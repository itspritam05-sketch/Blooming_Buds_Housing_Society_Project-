-- ============================================================================
-- BLOOMING BUDS HOUSING SOCIETY - RELATIONAL DATABASE SCHEMA (PostgreSQL)
-- ============================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(32),
  role VARCHAR(32) DEFAULT 'customer',
  avatar TEXT,
  is_verified BOOLEAN DEFAULT TRUE,
  saved_properties JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS properties (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  society_name VARCHAR(255) NOT NULL,
  property_type VARCHAR(64) NOT NULL,
  bhk VARCHAR(32) NOT NULL,
  rent NUMERIC(12, 2) NOT NULL,
  rent_type VARCHAR(32) NOT NULL,
  deposit_amount NUMERIC(12, 2) DEFAULT 0,
  electricity_charges VARCHAR(64),
  maintenance_charges NUMERIC(12, 2) DEFAULT 0,
  stay_duration JSONB DEFAULT '[]',
  available_from VARCHAR(100),
  furnishing VARCHAR(64),
  gender_preference VARCHAR(32),
  occupancy VARCHAR(64),
  city VARCHAR(100) NOT NULL,
  area VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  pincode VARCHAR(20),
  lat NUMERIC(9, 6),
  lng NUMERIC(9, 6),
  rooms_count INT DEFAULT 1,
  beds_count INT DEFAULT 1,
  bathrooms_count INT DEFAULT 1,
  balcony BOOLEAN DEFAULT FALSE,
  balcony_count INT DEFAULT 0,
  floor_number INT DEFAULT 1,
  total_floors INT DEFAULT 1,
  images JSONB DEFAULT '[]',
  virtual_tour_url TEXT,
  video_url TEXT,
  description TEXT,
  amenities JSONB DEFAULT '[]',
  rules JSONB DEFAULT '[]',
  nearby_landmarks JSONB,
  owner_info JSONB,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  food_included BOOLEAN DEFAULT FALSE,
  parking BOOLEAN DEFAULT TRUE,
  pets_allowed BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 1,
  created_at DATE DEFAULT CURRENT_DATE
);

-- 3. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(64) PRIMARY KEY,
  property_id VARCHAR(64) REFERENCES properties(id),
  property_title VARCHAR(255),
  property_image TEXT,
  property_type VARCHAR(64),
  society_name VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  user_id VARCHAR(64) REFERENCES users(id),
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  user_phone VARCHAR(32),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests_count INT DEFAULT 1,
  stay_duration VARCHAR(64),
  rent_type VARCHAR(32),
  base_rent NUMERIC(12, 2),
  deposit_amount NUMERIC(12, 2),
  maintenance_amount NUMERIC(12, 2) DEFAULT 0,
  discount_amount NUMERIC(12, 2) DEFAULT 0,
  tax_amount NUMERIC(12, 2) DEFAULT 0,
  total_amount NUMERIC(12, 2) NOT NULL,
  payment_status VARCHAR(32) DEFAULT 'Paid',
  payment_method VARCHAR(64),
  transaction_id VARCHAR(128),
  booking_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(32) DEFAULT 'Confirmed',
  invoice_number VARCHAR(64),
  special_requests TEXT
);

-- 4. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(64) PRIMARY KEY,
  property_id VARCHAR(64) REFERENCES properties(id) ON DELETE CASCADE,
  user_id VARCHAR(64) REFERENCES users(id),
  user_name VARCHAR(255),
  user_avatar TEXT,
  user_role VARCHAR(64),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  date DATE DEFAULT CURRENT_DATE,
  comment TEXT,
  likes INT DEFAULT 0,
  is_verified_stay BOOLEAN DEFAULT TRUE,
  helpful_count INT DEFAULT 0
);

-- 5. COMPLAINTS & MAINTENANCE TABLE
CREATE TABLE IF NOT EXISTS complaints (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id),
  user_name VARCHAR(255),
  property_id VARCHAR(64),
  property_title VARCHAR(255),
  type VARCHAR(64) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(32) DEFAULT 'Open',
  priority VARCHAR(32) DEFAULT 'Medium',
  created_at DATE DEFAULT CURRENT_DATE
);

-- INDEXES FOR FAST SEARCH
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_rent ON properties(rent);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_property ON reviews(property_id);
