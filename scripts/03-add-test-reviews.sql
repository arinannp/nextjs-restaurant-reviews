-- Add more test reviews to demonstrate the rating system
DO $$
DECLARE
    coffee_corner_id UUID;
    bella_vista_id UUID;
    quick_bites_id UUID;
    sunrise_diner_id UUID;
    brew_bean_id UUID;
    taco_express_id UUID;
    user_id UUID;
    admin_id UUID;
BEGIN
    -- Get restaurant IDs
    SELECT id INTO coffee_corner_id FROM restaurants WHERE name = 'The Coffee Corner';
    SELECT id INTO bella_vista_id FROM restaurants WHERE name = 'Bella Vista Restaurant';
    SELECT id INTO quick_bites_id FROM restaurants WHERE name = 'Quick Bites Cafe';
    SELECT id INTO sunrise_diner_id FROM restaurants WHERE name = 'Sunrise Diner';
    SELECT id INTO brew_bean_id FROM restaurants WHERE name = 'Brew & Bean';
    SELECT id INTO taco_express_id FROM restaurants WHERE name = 'Taco Express';
    
    -- Get user IDs
    SELECT id INTO user_id FROM users WHERE email = 'user@example.com';
    SELECT id INTO admin_id FROM users WHERE email = 'admin@reviewspot.com';
    
    -- Add more reviews for The Coffee Corner (should have high average rating)
    INSERT INTO reviews (restaurant_id, user_id, rating, comment, created_at) VALUES 
    (coffee_corner_id, user_id, 5, 'Absolutely love this place! The baristas are incredibly skilled and the atmosphere is perfect for working. Their signature latte is to die for!', NOW() - INTERVAL '2 days'),
    (coffee_corner_id, admin_id, 4, 'Great coffee and cozy ambiance. The WiFi is reliable and they have plenty of seating. Gets busy during lunch hours but worth the wait.', NOW() - INTERVAL '1 day'),
    (coffee_corner_id, user_id, 5, 'Best coffee shop in downtown! The pastries are always fresh and the staff remembers your order. Highly recommend the chocolate croissant.', NOW() - INTERVAL '3 hours'),
    (coffee_corner_id, admin_id, 4, 'Solid coffee shop with good vibes. The espresso is excellent and they have oat milk options. Parking can be tricky during peak hours.', NOW() - INTERVAL '1 hour');
    
    -- Add reviews for Bella Vista Restaurant (fine dining - mixed ratings)
    INSERT INTO reviews (restaurant_id, user_id, rating, comment, created_at) VALUES 
    (bella_vista_id, user_id, 5, 'Exceptional dining experience! The pasta was perfectly cooked and the wine selection is outstanding. Service was impeccable throughout the evening.', NOW() - INTERVAL '5 days'),
    (bella_vista_id, admin_id, 3, 'Food was good but overpriced for the portion sizes. The ambiance is nice but service was slow. Expected more for the price point.', NOW() - INTERVAL '4 days'),
    (bella_vista_id, user_id, 4, 'Beautiful restaurant with authentic Italian flavors. The tiramisu was heavenly! Reservation required, so plan ahead.', NOW() - INTERVAL '2 days'),
    (bella_vista_id, admin_id, 5, 'Outstanding meal from start to finish. The chef clearly knows their craft. Perfect for special occasions. Will definitely return!', NOW() - INTERVAL '6 hours');
    
    -- Add reviews for Quick Bites Cafe (casual, good ratings)
    INSERT INTO reviews (restaurant_id, user_id, rating, comment, created_at) VALUES 
    (quick_bites_id, user_id, 4, 'Perfect for a quick healthy lunch! The quinoa bowl was delicious and filling. Great smoothie selection too.', NOW() - INTERVAL '3 days'),
    (quick_bites_id, admin_id, 4, 'Clean, modern cafe with fresh ingredients. The avocado toast is excellent. Good for takeout when you''re in a hurry.', NOW() - INTERVAL '2 days'),
    (quick_bites_id, user_id, 3, 'Decent food but nothing special. The smoothies are overpriced. Service is fast though, which is nice for lunch breaks.', NOW() - INTERVAL '1 day'),
    (quick_bites_id, admin_id, 5, 'Love the healthy options here! The acai bowl is my favorite. Staff is friendly and the place is always clean.', NOW() - INTERVAL '4 hours');
    
    -- Add reviews for Sunrise Diner (classic diner - good comfort food)
    INSERT INTO reviews (restaurant_id, user_id, rating, comment, created_at) VALUES 
    (sunrise_diner_id, user_id, 5, 'Best breakfast in town! Huge portions and classic diner atmosphere. The pancakes are fluffy and the coffee keeps coming.', NOW() - INTERVAL '6 days'),
    (sunrise_diner_id, admin_id, 4, 'Solid comfort food and friendly service. The hash browns are crispy perfection. Great value for money.', NOW() - INTERVAL '4 days'),
    (sunrise_diner_id, user_id, 4, 'Nostalgic diner experience with generous portions. The pie selection is amazing! Can get crowded on weekends.', NOW() - INTERVAL '1 day'),
    (sunrise_diner_id, admin_id, 3, 'Good food but the place could use some updating. Service is hit or miss depending on how busy they are.', NOW() - INTERVAL '8 hours');
    
    -- Add reviews for Brew & Bean (specialty coffee - high ratings)
    INSERT INTO reviews (restaurant_id, user_id, rating, comment, created_at) VALUES 
    (brew_bean_id, user_id, 5, 'Coffee enthusiast paradise! They roast their own beans and you can taste the difference. The baristas are true artists.', NOW() - INTERVAL '7 days'),
    (brew_bean_id, admin_id, 5, 'Incredible single-origin coffees. Each cup tells a story. The pour-over technique is flawless. A must-visit for coffee lovers!', NOW() - INTERVAL '5 days'),
    (brew_bean_id, user_id, 4, 'Amazing coffee quality but limited seating. Perfect for takeaway. The Ethiopian blend is my personal favorite.', NOW() - INTERVAL '3 days'),
    (brew_bean_id, admin_id, 5, 'Best coffee roastery in the city! The staff is knowledgeable and passionate. You can buy beans to take home too.', NOW() - INTERVAL '2 hours');
    
    -- Add reviews for Taco Express (fast food - mixed ratings)
    INSERT INTO reviews (restaurant_id, user_id, rating, comment, created_at) VALUES 
    (taco_express_id, user_id, 4, 'Authentic Mexican flavors and reasonable prices. The carnitas tacos are excellent. Quick service even during lunch rush.', NOW() - INTERVAL '8 days'),
    (taco_express_id, admin_id, 3, 'Decent tacos but inconsistent quality. Sometimes great, sometimes just okay. The salsa verde is always good though.', NOW() - INTERVAL '6 days'),
    (taco_express_id, user_id, 2, 'Disappointed with my last visit. Food was cold and service was slow. The place seemed understaffed.', NOW() - INTERVAL '4 days'),
    (taco_express_id, admin_id, 4, 'Good value for money. The fish tacos are surprisingly good. Not fancy but hits the spot when you''re craving Mexican food.', NOW() - INTERVAL '1 day'),
    (taco_express_id, user_id, 5, 'Love this place! Fresh ingredients and bold flavors. The guacamole is made fresh daily. Great for a quick meal.', NOW() - INTERVAL '5 hours');

END $$;
