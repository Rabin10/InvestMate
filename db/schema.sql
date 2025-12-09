-- Users for Google OAuth
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  google_id TEXT NOT NULL UNIQUE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reset old table if you had it
DROP TABLE IF EXISTS investments;

-- Investments for each user
CREATE TABLE IF NOT EXISTS investments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  asset_type TEXT DEFAULT 'Stock',
  shares NUMERIC(18, 8) NOT NULL CHECK (shares > 0),
  buy_price NUMERIC(18, 8) NOT NULL CHECK (buy_price >= 0),
  buy_date DATE NOT NULL,
  notes TEXT
);
