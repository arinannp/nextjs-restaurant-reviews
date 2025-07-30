-- Insert admin user (password: admin123 - hashed with bcrypt)
INSERT INTO users (email, password, name, role) VALUES 
('admin@reviewspot.com', '$2a$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqQqQqQqQqQqQq', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample regular user (password: user123)
INSERT INTO users (email, password, name, role) VALUES 
('user@example.com', '$2a$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqQqQqQqQqQqQq', 'John Doe', 'user')
ON CONFLICT (email) DO NOTHING;

-- Insert sample restaurants
INSERT INTO restaurants (name, description, address, location, category, image_url, tags) VALUES 
(
    'The Coffee Corner', 
    'Cozy coffee shop with artisan brews and freshly baked pastries. Perfect spot for remote work or catching up with friends.',
    '123 Main Street, Downtown District', 
    'Downtown', 
    'coffee_shop',
    '/placeholder.svg?height=300&width=500',
    '["cozy", "artisan", "wifi", "pastries", "laptop-friendly"]'
),
(
    'Bella Vista Restaurant', 
    'Authentic Italian fine dining experience with handmade pasta and an extensive wine collection.',
    '456 Oak Avenue, Uptown Plaza', 
    'Uptown', 
    'fine_dining',
    '/placeholder.svg?height=300&width=500',
    '["italian", "romantic", "wine", "pasta", "date-night"]'
),
(
    'Quick Bites Cafe', 
    'Fast and fresh casual dining with healthy options, smoothies, and grab-and-go meals.',
    '789 Pine Street, Midtown Center', 
    'Midtown', 
    'cafe',
    '/placeholder.svg?height=300&width=500',
    '["fast", "healthy", "casual", "smoothies", "takeout"]'
),
(
    'Sunrise Diner', 
    'Classic American diner serving hearty breakfasts and comfort food all day long.',
    '321 Elm Street, Westside', 
    'Westside', 
    'restaurant',
    '/placeholder.svg?height=300&width=500',
    '["breakfast", "comfort-food", "family-friendly", "all-day", "classic"]'
),
(
    'Brew & Bean', 
    'Specialty coffee roastery with single-origin beans and expert baristas.',
    '654 Maple Drive, Eastside', 
    'Eastside', 
    'coffee_shop',
    '/placeholder.svg?height=300&width=500',
    '["specialty-coffee", "roastery", "single-origin", "expert-baristas"]'
),
(
    'Taco Express', 
    'Authentic Mexican fast food with fresh ingredients and bold flavors.',
    '987 Cedar Lane, Southside', 
    'Southside', 
    'fast_food',
    '/placeholder.svg?height=300&width=500',
    '["mexican", "authentic", "fresh", "spicy", "quick-service"]'
)
ON CONFLICT DO NOTHING;

-- Insert sample reviews
DO $$
DECLARE
    coffee_corner_id UUID;
    bella_vista_id UUID;
    quick_bites_id UUID;
    user_id UUID;
    admin_id UUID;
BEGIN
    -- Get restaurant IDs
    SELECT id INTO coffee_corner_id FROM restaurants WHERE name = 'The Coffee Corner';
    SELECT id INTO bella_vista_id FROM restaurants WHERE name = 'Bella Vista Restaurant';
    SELECT id INTO quick_bites_id FROM restaurants WHERE name = 'Quick Bites Cafe';
    
    -- Get user IDs
    SELECT id INTO user_id FROM users WHERE email = 'user@example.com';
    SELECT id INTO admin_id FROM users WHERE email = 'admin@reviewspot.com';
    
    -- Insert reviews for The Coffee Corner
    INSERT INTO reviews (restaurant_id, user_id, rating, comment) VALUES 
    (coffee_corner_id, user_id, 5, 'Amazing coffee and such a cozy atmosphere! Perfect place to work on my laptop. The baristas really know their craft.'),
    (coffee_corner_id, admin_id, 4, 'Great coffee selection and friendly staff. The pastries are fresh and delicious. Gets a bit crowded during peak hours.');
    
    -- Insert reviews for Bella Vista Restaurant
    INSERT INTO reviews (restaurant_id, user_id, rating, comment) VALUES 
    (bella_vista_id, user_id, 5, 'Exceptional Italian cuisine! The pasta was perfectly al dente and the wine pairing was spot on. Perfect for our anniversary dinner.'),
    (bella_vista_id, admin_id, 4, 'Authentic Italian flavors and elegant ambiance. Service was attentive. Slightly pricey but worth it for special occasions.');
    
    -- Insert reviews for Quick Bites Cafe
    INSERT INTO reviews (restaurant_id, user_id, rating, comment) VALUES 
    (quick_bites_id, user_id, 4, 'Great healthy options and quick service. The smoothies are fantastic and perfect for a post-workout meal.'),
    (quick_bites_id, admin_id, 3, 'Decent food and fast service. Good for a quick lunch but nothing extraordinary. Clean and modern interior.');
    
END $$;
