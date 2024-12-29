-- db.sql
CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,       -- Unique identifier for each goal
    title TEXT NOT NULL,                        -- Title of the goal
    initial_value INTEGER,                      -- Initial value for the goal
    current_value INTEGER,                      -- Current value of the goal
    target_value INTEGER,                       -- Target value for the goal
    unit TEXT,                                  -- Unit of measurement (e.g., "steps", "hours")
    priority TEXT DEFAULT 'Medium',             -- Priority level (default is 'Medium')
    status TEXT DEFAULT 'Pending',              -- Status of the goal (default is 'Pending')
    due_date TIMESTAMP,                         -- Due date for the goal
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the goal is created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp when the goal is last updated
);
