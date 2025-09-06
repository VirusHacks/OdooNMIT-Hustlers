-- Seed the database with initial data for EcoFinds marketplace

-- Insert categories
INSERT INTO categories (id, name, slug, description) VALUES
('cat_1', 'Fashion', 'fashion', 'Clothing, shoes, and accessories'),
('cat_2', 'Electronics', 'electronics', 'Phones, laptops, and gadgets'),
('cat_3', 'Home & Garden', 'home-garden', 'Furniture, decor, and garden items'),
('cat_4', 'Books', 'books', 'Fiction, non-fiction, and textbooks'),
('cat_5', 'Sports & Outdoors', 'sports-outdoors', 'Equipment and gear for sports and outdoor activities'),
('cat_6', 'Beauty & Health', 'beauty-health', 'Cosmetics, skincare, and wellness products')
ON CONFLICT (id) DO NOTHING;

-- Insert sample users (with hashed passwords for 'password123')
INSERT INTO users (id, email, name, password, bio, location) VALUES
('user_1', 'alice@example.com', 'Alice Johnson', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Sustainable fashion enthusiast', 'San Francisco, CA'),
('user_2', 'bob@example.com', 'Bob Smith', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Tech lover and minimalist', 'Austin, TX'),
('user_3', 'carol@example.com', 'Carol Davis', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Home decor collector', 'Portland, OR'),
('user_4', 'david@example.com', 'David Wilson', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Outdoor adventure seeker', 'Denver, CO')
ON CONFLICT (id) DO NOTHING;

-- Insert sample listings
INSERT INTO listings (id, title, description, price, condition, brand, size, color, images, seller_id, category_id) VALUES
('listing_1', 'Vintage Leather Jacket', 'Beautiful vintage leather jacket in excellent condition. Perfect for fall and winter.', 89.99, 'EXCELLENT', 'Vintage', 'M', 'Black', ARRAY['/placeholder.svg?height=400&width=400'], 'user_1', 'cat_1'),
('listing_2', 'iPhone 13 Pro', 'Gently used iPhone 13 Pro with original box and accessories. No scratches or damage.', 699.99, 'VERY_GOOD', 'Apple', '128GB', 'Graphite', ARRAY['/placeholder.svg?height=400&width=400'], 'user_2', 'cat_2'),
('listing_3', 'Mid-Century Modern Chair', 'Authentic mid-century modern chair, recently reupholstered. A statement piece for any room.', 299.99, 'GOOD', 'Herman Miller', 'Standard', 'Orange', ARRAY['/placeholder.svg?height=400&width=400'], 'user_3', 'cat_3'),
('listing_4', 'The Great Gatsby - First Edition', 'Rare first edition of The Great Gatsby in very good condition. A collectors item.', 1299.99, 'VERY_GOOD', 'Scribner', 'Standard', 'Green', ARRAY['/placeholder.svg?height=400&width=400'], 'user_1', 'cat_4'),
('listing_5', 'Mountain Bike', 'High-quality mountain bike, perfect for trails. Well-maintained with recent tune-up.', 449.99, 'GOOD', 'Trek', '21 inch', 'Blue', ARRAY['/placeholder.svg?height=400&width=400'], 'user_4', 'cat_5'),
('listing_6', 'Chanel No. 5 Perfume', 'Classic Chanel No. 5 perfume, 50ml bottle, 80% full. Authentic and in great condition.', 79.99, 'VERY_GOOD', 'Chanel', '50ml', 'Clear', ARRAY['/placeholder.svg?height=400&width=400'], 'user_3', 'cat_6')
ON CONFLICT (id) DO NOTHING;

-- Insert sample cart items
INSERT INTO cart_items (id, user_id, listing_id, quantity) VALUES
('cart_1', 'user_2', 'listing_1', 1),
('cart_2', 'user_3', 'listing_2', 1)
ON CONFLICT (user_id, listing_id) DO NOTHING;

-- Insert sample orders
INSERT INTO orders (id, order_number, status, total_amount, shipping_address, seller_id, buyer_id) VALUES
('order_1', 'ECO-2024-001', 'DELIVERED', 89.99, '123 Main St, San Francisco, CA 94102', 'user_1', 'user_2'),
('order_2', 'ECO-2024-002', 'SHIPPED', 299.99, '456 Oak Ave, Austin, TX 73301', 'user_3', 'user_4')
ON CONFLICT (id) DO NOTHING;

-- Insert order items
INSERT INTO order_items (id, order_id, listing_id, quantity, price) VALUES
('order_item_1', 'order_1', 'listing_1', 1, 89.99),
('order_item_2', 'order_2', 'listing_3', 1, 299.99)
ON CONFLICT (id) DO NOTHING;
