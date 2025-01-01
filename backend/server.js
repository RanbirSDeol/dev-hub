// Ranbir Deol
// December 29, 2024
// Server-side code for the Goal Tracker app

require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();  // Import sqlite3
const app = express();
const port = process.env.PORT;
const bcrypt = require('bcrypt');

// | Documentation |
/*
[http://localhost:port]

'/' : A simple api check

*/

// Middleware to parse JSON
app.use(express.json());

// | GOALS |

// SQLite connection
const db = new sqlite3.Database(process.env.DB, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Simple route to check the server
app.get("/", (req, res) => {
  res.send("Goal Tracker API is running");
});

// Route to get all goals | GET
app.get("/goals", (req, res) => {
  db.all("SELECT * FROM goals", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ goals: rows });
    }
  });
});

// Route to add a new goal | POST
app.post("/goals", (req, res) => {
  const { title, initial_value, current_value, target_value, unit, priority, status, due_date } = req.body;
  const sql = `INSERT INTO goals (title, initial_value, current_value, target_value, unit, priority, status, due_date) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [title, initial_value, current_value, target_value, unit, priority, status, due_date], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({
        id: this.lastID,
        title,
        initial_value,
        current_value,
        target_value,
        unit,
        priority,
        status,
        due_date
      });
    }
  });
});

// Route to update a goal | PUT
app.put("/goals/:id", (req, res) => {
  const { title, initial_value, current_value, target_value, unit, priority, status, due_date } = req.body;
  const { id } = req.params;

  const sql = `UPDATE goals SET title = ?, initial_value = ?, current_value = ?, target_value = ?, unit = ?, 
               priority = ?, status = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

  db.run(sql, [title, initial_value, current_value, target_value, unit, priority, status, due_date, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ message: "Goal not found" });
    } else {
      res.json({
        id,
        title,
        initial_value,
        current_value,
        target_value,
        unit,
        priority,
        status,
        due_date
      });
    }
  });
});

// Route to delete a goal | DELETE
app.delete("/goals/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM goals WHERE id = ?`;

  db.run(sql, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ message: "Goal not found" });
    } else {
      res.status(204).send();
    }
  });
});

// | USERS |

// Route to get all registered users | GET
app.get('/users', async (req, res) => {
  const sql = 'SELECT id, email, created_at FROM users';

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching users: ', err);
      return res.status(500).json({ error: 'Internal server error.' })
    }

    res.status(200).json({ users: rows })
  })
})

// Route to register a new user | POST
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;
    db.run(sql, [email, hashedPassword], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email already in use.' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, email });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
