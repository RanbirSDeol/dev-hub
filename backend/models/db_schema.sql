-- Users Table
CREATE TABLE IF NOT EXISTS users (
  name TEXT NOT NULL UNIQUE,
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Goals Table
CREATE TABLE IF NOT EXISTS goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,                     
  title TEXT NOT NULL,
  initial_value INTEGER,
  current_value INTEGER,
  target_value INTEGER,
  unit TEXT,
  priority TEXT DEFAULT 'Medium',
  status TEXT DEFAULT 'Pending',
  due_date TIMESTAMP,
  finished_date TIMESTAMP, 
  created_at TIMESTAMP DEFAULT (datetime('now', '-5 hours')),  -- Adjust for EST (UTC-5)
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
