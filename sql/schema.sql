CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  balance INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  invoice_number VARCHAR(50) NOT NULL,
  transaction_type VARCHAR(20), -- TOPUP / PAYMENT
  description TEXT,
  total_amount INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
