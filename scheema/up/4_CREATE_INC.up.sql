CREATE TABLE IF NOT EXISTS income (
  income_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  amount MONEY NOT NULL,
  source VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  notes TEXT
)
