-- Create the database tables
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE role AS ENUM ('user', 'admin');
CREATE TYPE category AS ENUM ('restaurant', 'coffee_shop', 'cafe', 'fast_food', 'fine_dining');

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role role DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create restaurants table
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  location TEXT NOT NULL,
  category category NOT NULL,
  image_url TEXT,
  tags TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Insert sample admin user (password: admin123)
INSERT INTO users (email, password, name, role) VALUES 
('admin@example.com', '$2a$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqQqQqQqQqQqQq', 'Admin User', 'admin');

-- Insert sample restaurants
INSERT INTO restaurants (name, description, address, location, category, tags) VALUES 
('The Coffee Corner', 'Cozy coffee shop with artisan brews', '123 Main St', 'Downtown', 'coffee_shop', '["cozy", "artisan", "wifi"]'),
('Bella Vista Restaurant', 'Fine Italian dining experience', '456 Oak Ave', 'Uptown', 'fine_dining', '["italian", "romantic", "wine"]'),
('Quick Bites Cafe', 'Fast and fresh casual dining', '789 Pine St', 'Midtown', 'cafe', '["fast", "healthy", "casual"]');
