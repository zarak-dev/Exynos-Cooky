-- ============================================================
-- EXYNOS COOKY — INITIAL SEED DATA
-- ============================================================

-- Seed Coupons
INSERT INTO public.coupons (id, code, discount_type, discount_value, minimum_order, maximum_discount, is_active)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'WELCOME10', 'percentage', 10, 1000, 500, true),
    ('c0000000-0000-0000-0000-000000000002', 'SWEET20', 'percentage', 20, 2500, 1000, true),
    ('c0000000-0000-0000-0000-000000000003', 'FREESHIP', 'fixed', 150, 1200, 150, true)
ON CONFLICT (code) DO NOTHING;

-- Seed Sample Products
INSERT INTO public.products (id, name, description, price, stock_quantity, image_url, is_available, category)
OVERRIDING SYSTEM VALUE
VALUES
    (2, 'Chocolate Chip', 'Classic Chocolate Chip Cookies... The Perfect Bite of Nostalgia', 1290, 18, 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80&auto=format&fit=crop', true, 'chocolate'),
    (3, 'Pink Velvet', 'A velvety cake batter cookie topped with a swirl of vanilla cream.', 1350, 12, 'https://images.unsplash.com/photo-1576717585968-8ea8166b89b8?w=800&q=80&auto=format&fit=crop', true, 'velvet_fruit'),
    (4, 'Chilled Sugar', 'A vanilla sugar cookie served chilled and topped with sweet almond.', 1190, 20, 'https://images.unsplash.com/photo-1597733153203-a54d0fbc47de?w=800&q=80&auto=format&fit=crop', true, 'classic'),
    (5, 'Milkshake Dream', 'A chilled cookie featuring layers of malted milkshake mousse and a cherry on top.', 1420, 0, 'https://images.unsplash.com/photo-1612845575953-f4b1e3d63160?w=800&q=80&auto=format&fit=crop', false, 'specialty'),
    (6, 'Lotus Biscoff Lava', 'Packed with Biscoff cookie pieces and drizzled with white chocolate.', 1490, 8, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80&auto=format&fit=crop', true, 'specialty'),
    (7, 'Chocolate Fudge', 'A rich, dark chocolate cookie loaded and drizzled with a hot fudge glaze.', 1290, 15, 'https://images.unsplash.com/photo-1590080874088-eec64895b423?w=800&q=80&auto=format&fit=crop', true, 'chocolate'),
    (8, 'Red Velvet Cream', 'Rich cocoa dough loaded with white chocolate chips and vanilla cream cheese.', 1390, 10, 'https://images.unsplash.com/photo-1587248720327-8eb72564be1e?w=800&q=80&auto=format&fit=crop', true, 'velvet_fruit'),
    (9, 'Peanut Butter Burst', 'Dense peanut butter cookie packed with Reese''s cups and a peanut butter core.', 1310, 14, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80&auto=format&fit=crop', true, 'specialty'),
    (10, 'Cinnamon Roll Swirl', 'Spiced snickerdoodle base with a caramelized brown sugar and cream cheese glaze.', 1250, 22, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80&auto=format&fit=crop', true, 'classic'),
    (11, 'Salted Caramel Crunch', 'Buttery dough stuffed with caramel and sprinkled with Maldon flaky sea salt.', 1440, 6, 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80&auto=format&fit=crop', true, 'specialty'),
    (12, 'S''mores Campfire', 'Graham cracker dough loaded with toasted marshmallows and milk chocolate.', 1480, 11, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80&auto=format&fit=crop', true, 'chocolate'),
    (13, 'Matcha White Choco', 'Earthy ceremonial matcha green tea cookie balanced with creamy Belgian chocolate.', 1360, 16, 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=800&q=80&auto=format&fit=crop', true, 'specialty')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    description = EXCLUDED.description;
