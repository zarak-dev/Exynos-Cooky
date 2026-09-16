-- ============================================================
-- Migration: Fix create_order_with_items RPC signature and PostgREST schema cache
-- Ensures compatibility with (order_data, items_data, coupon_code)
-- ============================================================

-- 1. Drop existing functions with varying parameter lists to avoid ambiguity
DROP FUNCTION IF EXISTS public.create_order_with_items(JSONB, JSONB);
DROP FUNCTION IF EXISTS public.create_order_with_items(JSONB, JSONB, TEXT);

-- 2. Create the authoritative create_order_with_items function
CREATE OR REPLACE FUNCTION public.create_order_with_items(
    order_data JSONB,
    items_data JSONB,
    coupon_code TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    item JSONB;
    p_id BIGINT;
    p_stock INTEGER;
    p_avail BOOLEAN;
    p_price NUMERIC;
    p_name TEXT;
    req_qty INTEGER;
    item_subtotal NUMERIC;

    calc_subtotal NUMERIC := 0;
    calc_delivery_fee NUMERIC := 150;
    calc_discount NUMERIC := 0;
    calc_total NUMERIC := 0;

    c_row RECORD;
    v_order_id TEXT;
    v_user_id UUID;
    created_items JSONB := '[]'::jsonb;
BEGIN
    -- 1. Validate items presence
    IF items_data IS NULL OR jsonb_array_length(items_data) = 0 THEN
        RAISE EXCEPTION 'Order must contain at least one item';
    END IF;

    -- 2. Determine Order ID
    v_order_id := COALESCE(NULLIF(order_data->>'id', ''), 'EXY-' || floor(10000 + random() * 90000)::text);

    -- 3. Determine User ID (prefer authenticated session UID, fallback to provided user_id)
    v_user_id := auth.uid();
    IF v_user_id IS NULL AND order_data->>'user_id' IS NOT NULL AND order_data->>'user_id' <> '' THEN
        BEGIN
            v_user_id := (order_data->>'user_id')::UUID;
        EXCEPTION WHEN OTHERS THEN
            v_user_id := NULL;
        END;
    END IF;

    -- 4. Validate products & stock atomically with row locks, compute item subtotals
    FOR item IN SELECT * FROM jsonb_array_elements(items_data) LOOP
        p_id := (item->>'product_id')::BIGINT;
        req_qty := (item->>'quantity')::INTEGER;

        IF req_qty IS NULL OR req_qty <= 0 THEN
            RAISE EXCEPTION 'Invalid quantity % for product ID %', req_qty, p_id;
        END IF;

        -- Lock product row exclusively
        SELECT id, name, price, stock_quantity, is_available
        INTO p_id, p_name, p_price, p_stock, p_avail
        FROM public.products
        WHERE id = p_id
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product with ID % not found in bakery catalog', p_id;
        END IF;

        IF NOT p_avail THEN
            RAISE EXCEPTION 'Cookie "%" is currently sold out', p_name;
        END IF;

        IF p_stock < req_qty THEN
            RAISE EXCEPTION 'Insufficient stock for "%". Available: %, Requested: %',
                p_name, p_stock, req_qty;
        END IF;

        -- Calculate server-authoritative item financial subtotal
        item_subtotal := p_price * req_qty;
        calc_subtotal := calc_subtotal + item_subtotal;

        -- Atomically decrement stock
        UPDATE public.products
        SET stock_quantity = stock_quantity - req_qty,
            is_available = CASE WHEN (stock_quantity - req_qty) <= 0 THEN false ELSE is_available END,
            updated_at = NOW()
        WHERE id = p_id;

        -- Append to calculated items list
        created_items := created_items || jsonb_build_object(
            'product_id', p_id,
            'product_name_snapshot', p_name,
            'unit_price', p_price,
            'quantity', req_qty,
            'subtotal', item_subtotal
        );
    END LOOP;

    -- 5. Authoritative delivery fee
    IF order_data->>'delivery_fee' IS NOT NULL AND (order_data->>'delivery_fee') <> '' THEN
        calc_delivery_fee := (order_data->>'delivery_fee')::NUMERIC;
    ELSE
        calc_delivery_fee := 150;
    END IF;

    -- 6. Server-side coupon validation
    IF coupon_code IS NOT NULL AND TRIM(coupon_code) <> '' THEN
        SELECT * INTO c_row
        FROM public.coupons
        WHERE UPPER(code) = UPPER(TRIM(coupon_code))
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Coupon code "%" is invalid', coupon_code;
        END IF;

        IF NOT c_row.is_active THEN
            RAISE EXCEPTION 'Coupon "%" is inactive', c_row.code;
        END IF;

        IF c_row.start_date IS NOT NULL AND c_row.start_date > NOW() THEN
            RAISE EXCEPTION 'Coupon "%" is not valid yet', c_row.code;
        END IF;

        IF c_row.expiry_date IS NOT NULL AND c_row.expiry_date < NOW() THEN
            RAISE EXCEPTION 'Coupon "%" has expired', c_row.code;
        END IF;

        IF c_row.usage_limit IS NOT NULL AND c_row.used_count >= c_row.usage_limit THEN
            RAISE EXCEPTION 'Coupon "%" has reached its maximum usage limit', c_row.code;
        END IF;

        IF calc_subtotal < c_row.minimum_order THEN
            RAISE EXCEPTION 'Minimum order of Rs. % required for coupon "%"', c_row.minimum_order, c_row.code;
        END IF;

        -- Compute discount
        IF c_row.discount_type = 'percentage' THEN
            calc_discount := ROUND((calc_subtotal * c_row.discount_value) / 100);
            IF c_row.maximum_discount IS NOT NULL AND calc_discount > c_row.maximum_discount THEN
                calc_discount := c_row.maximum_discount;
            END IF;
        ELSE
            calc_discount := LEAST(c_row.discount_value, calc_subtotal);
        END IF;

        calc_discount := LEAST(calc_discount, calc_subtotal);

        -- Atomically increment usage count
        UPDATE public.coupons
        SET used_count = used_count + 1
        WHERE id = c_row.id;
    END IF;

    -- 7. Authoritative Total Price Calculation
    calc_total := GREATEST(0, calc_subtotal + calc_delivery_fee - calc_discount);

    -- 8. Insert Order Record
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
        timestamp,
        created_at,
        updated_at
    ) VALUES (
        v_order_id,
        v_user_id,
        COALESCE(order_data->>'customer_name', 'Valued Customer'),
        COALESCE(order_data->>'customer_email', 'guest@exynoscooky.com'),
        COALESCE(order_data->>'customer_phone', ''),
        COALESCE(order_data->>'delivery_address', ''),
        COALESCE(order_data->>'box_size', 'Custom Box'),
        COALESCE(order_data->>'contents', ''),
        calc_subtotal,
        calc_delivery_fee,
        calc_discount,
        calc_total,
        COALESCE(order_data->>'payment_method', 'cod'),
        COALESCE(order_data->>'payment_status', 'pending'),
        'Pending',
        NOW(),
        NOW(),
        NOW()
    );

    -- 9. Insert Order Items
    FOR item IN SELECT * FROM jsonb_array_elements(created_items) LOOP
        INSERT INTO public.order_items (
            order_id,
            product_id,
            product_name_snapshot,
            unit_price,
            quantity,
            subtotal,
            created_at
        ) VALUES (
            v_order_id,
            (item->>'product_id')::BIGINT,
            item->>'product_name_snapshot',
            (item->>'unit_price')::NUMERIC,
            (item->>'quantity')::INTEGER,
            (item->>'subtotal')::NUMERIC,
            NOW()
        );
    END LOOP;

    -- 10. Return authoritative order JSON
    RETURN jsonb_build_object(
        'id', v_order_id,
        'userId', v_user_id,
        'customerName', COALESCE(order_data->>'customer_name', 'Valued Customer'),
        'customerEmail', COALESCE(order_data->>'customer_email', 'guest@exynoscooky.com'),
        'customerPhone', COALESCE(order_data->>'customer_phone', ''),
        'deliveryAddress', COALESCE(order_data->>'delivery_address', ''),
        'boxSize', COALESCE(order_data->>'box_size', 'Custom Box'),
        'contents', COALESCE(order_data->>'contents', ''),
        'subtotal', calc_subtotal,
        'deliveryFee', calc_delivery_fee,
        'discount', calc_discount,
        'totalPrice', calc_total,
        'paymentMethod', COALESCE(order_data->>'payment_method', 'cod'),
        'paymentStatus', 'pending',
        'status', 'Pending',
        'timestamp', NOW(),
        'items', created_items
    );
END;
$$;

-- 3. Grant execute permissions to all roles
GRANT EXECUTE ON FUNCTION public.create_order_with_items(JSONB, JSONB, TEXT) TO authenticated, anon, service_role;

-- 4. Notify PostgREST to reload schema cache immediately
NOTIFY pgrst, 'reload schema';
