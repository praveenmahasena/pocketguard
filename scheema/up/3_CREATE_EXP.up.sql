CREATE TABLE IF NOT EXISTS expenses (
  expense_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  amount MONEY NOT NULL,
  place VARCHAR(100),
  expense_type VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  time TIME WITHOUT TIME ZONE
);
