-- ============================================================
-- FIX RLS POLICIES FOR PRODUCTS & ORDERS MANAGEMENT
-- ============================================================

-- Allow full product management from storefront & admin operations
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Allow product select" ON public.products;
DROP POLICY IF EXISTS "Allow product insert" ON public.products;
DROP POLICY IF EXISTS "Allow product update" ON public.products;
DROP POLICY IF EXISTS "Allow product delete" ON public.products;

CREATE POLICY "Allow product select"
ON public.products FOR SELECT
USING (true);

CREATE POLICY "Allow product insert"
ON public.products FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow product update"
ON public.products FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow product delete"
ON public.products FOR DELETE
USING (true);

-- Ensure orders and order_items are readable & updateable by admin dashboard
DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow orders select" ON public.orders;
CREATE POLICY "Allow orders select"
ON public.orders FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Allow orders update" ON public.orders;
CREATE POLICY "Allow orders update"
ON public.orders FOR UPDATE
USING (true);

DROP POLICY IF EXISTS "Order items viewable with order access" ON public.order_items;
DROP POLICY IF EXISTS "Allow order items select" ON public.order_items;
CREATE POLICY "Allow order items select"
ON public.order_items FOR SELECT
USING (true);
