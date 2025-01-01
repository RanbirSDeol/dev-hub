// Ranbir Singh Deol
// Last Updated: Jan 1, 2025
// Server-side code for the Goal Tracker app

require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();  // Import sqlite3
const app = express();
const cors = require('cors');
const port = process.env.PORT;
const bcrypt = require('bcrypt');

// | API Documentation |

/*
----
GET '/' : An API check
GET '/goals' : Returns all the goals
GET '/users' : Returns all the users
----
POST '/goals' : Adds a new goal
POST '/register' : Registers a new user
POST '/login' : Logs in a user
----
PUT '/goals/:id' : Updates a goal, all fields required
----
DELETE '/goals/:id' : Deletes a goal
----
*/

// Middleware to parse JSON
app.use(cors({
  origin: 'http://localhost:3000', // allow only localhost:3000 to access the server
}));
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
  const { user_id, title, initial_value, current_value, target_value, unit, priority, status, due_date } = req.body;
  
  // Validate user_id
  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const sql = `INSERT INTO goals (user_id, title, initial_value, current_value, target_value, unit, priority, status, due_date) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [user_id, title, initial_value, current_value, target_value, unit, priority, status, due_date], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({
        id: this.lastID,
        user_id,
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

  // Ensure the values array has the correct number of parameters
  const values = [
    title, 
    initial_value, 
    current_value, 
    target_value, 
    unit, 
    priority, 
    status, 
    due_date, 
    id  // Make sure the id is the last parameter
  ];

  db.run(sql, values, function (err) {
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

// Route to log in a user | POST
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Fetch user from the database by email
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error.' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Compare the provided password with the stored hash
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      // Password matched, send the user data (without the password)
      res.status(200).json({
        id: user.id,
        email: user.email,
        created_at: user.created_at
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
