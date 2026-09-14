-- ============================================================
-- EXYNOS COOKY — P0 SECURITY & DATA INTEGRITY MIGRATION
-- ============================================================

-- 1. SECURE PROFILES RLS POLICY (Prevent PII Scraping)
-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile or admin view all" ON public.profiles;

CREATE POLICY "Users can view own profile or admin view all"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.is_admin());

-- 2. SAFE PUBLIC REVIEWS FUNCTION (Hide customer emails/phones while serving reviews)
CREATE OR REPLACE FUNCTION public.get_public_reviews()
RETURNS TABLE (
    id UUID,
    product_id BIGINT,
    order_id TEXT,
    rating INTEGER,
    comment TEXT,
    verified_purchase BOOLEAN,
    created_at TIMESTAMPTZ,
    user_name TEXT,
    user_avatar TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.product_id,
        r.order_id,
        r.rating,
        r.comment,
        r.verified_purchase,
        r.created_at,
        COALESCE(p.full_name, 'Verified Customer') AS user_name,
        COALESCE(p.avatar_url, '') AS user_avatar
    FROM public.reviews r
    LEFT JOIN public.profiles p ON p.id = r.user_id
    ORDER BY r.created_at DESC;
END;
$$;

-- 3. ATOMIC ORDER CREATION & STOCK VALIDATION / DECREMENT
CREATE OR REPLACE FUNCTION public.create_order_with_items(
    order_data JSONB,
    items_data JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    item JSONB;
    p_id BIGINT;
    p_stock INTEGER;
    p_avail BOOLEAN;
    p_price NUMERIC;
    req_qty INTEGER;
    calc_subtotal NUMERIC := 0;
BEGIN
    -- Verify and decrement stock atomically with row-level locks
    FOR item IN SELECT * FROM jsonb_array_elements(items_data) LOOP
        p_id := (item->>'product_id')::BIGINT;
        req_qty := (item->>'quantity')::INTEGER;

        IF req_qty <= 0 THEN
            RAISE EXCEPTION 'Invalid quantity % for product ID %', req_qty, p_id;
        END IF;

        SELECT stock_quantity, is_available, price 
        INTO p_stock, p_avail, p_price
        FROM public.products
        WHERE id = p_id
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product with ID % not found', p_id;
        END IF;

        IF NOT p_avail THEN
            RAISE EXCEPTION 'Cookie "%" is currently sold out', (item->>'product_name_snapshot');
        END IF;

        IF p_stock < req_qty THEN
            RAISE EXCEPTION 'Insufficient stock for "%". Available: %, Requested: %',
                (item->>'product_name_snapshot'), p_stock, req_qty;
        END IF;

        -- Decrement stock
        UPDATE public.products
        SET stock_quantity = stock_quantity - req_qty,
            is_available = CASE WHEN (stock_quantity - req_qty) <= 0 THEN false ELSE is_available END,
            updated_at = NOW()
        WHERE id = p_id;

        calc_subtotal := calc_subtotal + (p_price * req_qty);
    END LOOP;

    -- Insert authoritative order
    INSERT INTO public.orders (
        id,
        user_id,
        customer_name,
        customer_email,
        customer_phone,
        delivery_address,
        box_size,
        contents,
        subtotal,
        delivery_fee,
        discount,
        total_price,
        payment_method,
        payment_status,
        status,
        timestamp
    ) VALUES (
        order_data->>'id',
        NULLIF(order_data->>'user_id', '')::UUID,
        order_data->>'customer_name',
        order_data->>'customer_email',
        COALESCE(order_data->>'customer_phone', ''),
        order_data->>'delivery_address',
        order_data->>'box_size',
        order_data->>'contents',
        (order_data->>'subtotal')::NUMERIC,
        (order_data->>'delivery_fee')::NUMERIC,
        COALESCE((order_data->>'discount')::NUMERIC, 0),
        (order_data->>'total_price')::NUMERIC,
        COALESCE(order_data->>'payment_method', 'cod'),
        COALESCE(order_data->>'payment_status', 'pending'),
        COALESCE(order_data->>'status', 'Pending'),
        COALESCE((order_data->>'timestamp')::TIMESTAMPTZ, NOW())
    );

    -- Insert order items
    FOR item IN SELECT * FROM jsonb_array_elements(items_data) LOOP
        INSERT INTO public.order_items (
            order_id,
            product_id,
            product_name_snapshot,
            unit_price,
            quantity,
            subtotal
        ) VALUES (
            order_data->>'id',
            (item->>'product_id')::BIGINT,
            item->>'product_name_snapshot',
            (item->>'unit_price')::NUMERIC,
            (item->>'quantity')::INTEGER,
            (item->>'subtotal')::NUMERIC
        );
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'order_id', order_data->>'id'
    );
END;
$$;

-- 4. ORDER CANCELLATION WITH STOCK RESTORATION
CREATE OR REPLACE FUNCTION public.cancel_order_and_restore_stock(target_order_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    curr_status TEXT;
    item RECORD;
BEGIN
    SELECT status INTO curr_status 
    FROM public.orders 
    WHERE id = target_order_id 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order % not found', target_order_id;
    END IF;

    IF curr_status = 'Cancelled' THEN
        RETURN jsonb_build_object('success', true, 'message', 'Order is already cancelled');
    END IF;

    IF curr_status NOT IN ('Pending', 'Confirmed') AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Order cannot be cancelled in "%" status', curr_status;
    END IF;

    -- Restore stock for items
    FOR item IN 
        SELECT product_id, quantity 
        FROM public.order_items 
        WHERE order_id = target_order_id 
    LOOP
        IF item.product_id IS NOT NULL THEN
            UPDATE public.products
            SET stock_quantity = stock_quantity + item.quantity,
                is_available = true,
                updated_at = NOW()
            WHERE id = item.product_id;
        END IF;
    END LOOP;

    UPDATE public.orders
    SET status = 'Cancelled',
        updated_at = NOW()
    WHERE id = target_order_id;

    RETURN jsonb_build_object('success', true, 'status', 'Cancelled');
END;
$$;

-- 5. SECURE ORDER LOOKUP FOR LIVE TRACKING (Allows guest tracking by exact Order ID)
CREATE OR REPLACE FUNCTION public.track_order_by_id(target_order_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    order_row RECORD;
    items_json JSONB;
BEGIN
    SELECT * INTO order_row 
    FROM public.orders 
    WHERE UPPER(id) = UPPER(target_order_id);

    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', oi.id,
        'productId', oi.product_id,
        'productNameSnapshot', oi.product_name_snapshot,
        'unitPrice', oi.unit_price,
        'quantity', oi.quantity,
        'subtotal', oi.subtotal
    )), '[]'::jsonb)
    INTO items_json
    FROM public.order_items oi
    WHERE oi.order_id = order_row.id;

    RETURN jsonb_build_object(
        'id', order_row.id,
        'customerName', order_row.customer_name,
        'customerEmail', order_row.customer_email,
        'customerPhone', order_row.customer_phone,
        'deliveryAddress', order_row.delivery_address,
        'boxSize', order_row.box_size,
        'contents', order_row.contents,
        'subtotal', order_row.subtotal,
        'deliveryFee', order_row.delivery_fee,
        'discount', order_row.discount,
        'totalPrice', order_row.total_price,
        'paymentMethod', order_row.payment_method,
        'paymentStatus', order_row.payment_status,
        'status', order_row.status,
        'timestamp', order_row.timestamp,
        'items', items_json
    );
END;
$$;
