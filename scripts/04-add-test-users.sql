-- Add more test users for diverse reviews
INSERT INTO users (email, password, name, role) VALUES 
('sarah.johnson@email.com', '$2a$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqQqQqQqQqQqQq', 'Sarah Johnson', 'user'),
('mike.chen@email.com', '$2a$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqQqQqQqQqQqQq', 'Mike Chen', 'user'),
('emma.davis@email.com', '$2a$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqQqQqQqQqQqQq', 'Emma Davis', 'user'),
('alex.rodriguez@email.com', '$2a$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqQqQqQqQqQqQq', 'Alex Rodriguez', 'user'),
('lisa.wong@email.com', '$2a$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqQqQqQqQqQqQq', 'Lisa Wong', 'user')
ON CONFLICT (email) DO NOTHING;

-- Add reviews from these new users
DO $$
DECLARE
    coffee_corner_id UUID;
    bella_vista_id UUID;
    quick_bites_id UUID;
    sunrise_diner_id UUID;
    brew_bean_id UUID;
    taco_express_id UUID;
    sarah_id UUID;
    mike_id UUID;
    emma_id UUID;
    alex_id UUID;
    lisa_id UUID;
BEGIN
    -- Get restaurant IDs
    SELECT id INTO coffee_corner_id FROM restaurants WHERE name = 'The Coffee Corner';
    SELECT id INTO bella_vista_id FROM restaurants WHERE name = 'Bella Vista Restaurant';
    SELECT id INTO quick_bites_id FROM restaurants WHERE name = 'Quick Bites Cafe';
    SELECT id INTO sunrise_diner_id FROM restaurants WHERE name = 'Sunrise Diner';
    SELECT id INTO brew_bean_id FROM restaurants WHERE name = 'Brew & Bean';
    SELECT id INTO taco_express_id FROM restaurants WHERE name = 'Taco Express';
    
    -- Get new user IDs
    SELECT id INTO sarah_id FROM users WHERE email = 'sarah.johnson@email.com';
    SELECT id INTO mike_id FROM users WHERE email = 'mike.chen@email.com';
    SELECT id INTO emma_id FROM users WHERE email = 'emma.davis@email.com';
    SELECT id INTO alex_id FROM users WHERE email = 'alex.rodriguez@email.com';
    SELECT id INTO lisa_id FROM users WHERE email = 'lisa.wong@email.com';
    
    -- Add diverse reviews from new users
    INSERT INTO reviews (restaurant_id, user_id, rating, comment, created_at) VALUES 
    -- Sarah's reviews
    (coffee_corner_id, sarah_id, 5, 'My go-to coffee shop! The atmosphere is perfect for studying and the staff is always friendly. Love their seasonal drinks!', NOW() - INTERVAL '12 hours'),
    (bella_vista_id, sarah_id, 4, 'Lovely dinner with my partner. The pasta was delicious but the wait time was a bit long. Overall a nice experience.', NOW() - INTERVAL '3 days'),
    
    -- Mike's reviews
    (brew_bean_id, mike_id, 5, 'As a coffee connoisseur, I can say this is the real deal. Their Ethiopian single-origin is phenomenal. Worth every penny!', NOW() - INTERVAL '1 day'),
    (taco_express_id, mike_id, 3, 'Average Mexican food. Nothing to write home about but fills you up. The location is convenient for lunch.', NOW() - INTERVAL '2 days'),
    
    -- Emma's reviews
    (quick_bites_id, emma_id, 5, 'Perfect for my healthy lifestyle! The Buddha bowl is packed with nutrients and tastes amazing. Clean eating made easy!', NOW() - INTERVAL '6 hours'),
    (sunrise_diner_id, emma_id, 4, 'Classic American breakfast done right. The portions are huge! Great place for weekend brunch with friends.', NOW() - INTERVAL '5 days'),
    
    -- Alex's reviews
    (bella_vista_id, alex_id, 5, 'Took my parents here for their anniversary and they loved it! Authentic Italian cuisine with excellent service. Highly recommend!', NOW() - INTERVAL '1 week'),
    (coffee_corner_id, alex_id, 4, 'Good coffee and reliable WiFi. Perfect for remote work. The only downside is it gets quite noisy during peak hours.', NOW() - INTERVAL '18 hours'),
    
    -- Lisa's reviews
    (taco_express_id, lisa_id, 4, 'Great value for money! The portions are generous and the flavors are authentic. The staff is always cheerful.', NOW() - INTERVAL '3 hours'),
    (brew_bean_id, lisa_id, 5, 'Coffee heaven! The baristas really know their craft. I love watching them prepare the pour-over. Educational and delicious!', NOW() - INTERVAL '2 days'),
    (quick_bites_id, lisa_id, 3, 'Healthy options are great but a bit pricey for the portion size. The smoothies are good though.', NOW() - INTERVAL '4 days');

END $$;
