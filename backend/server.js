// Ranbir Singh Deol
// Last Updated: Jan 1, 2025
// Server-side code for the Goal Tracker app

require("dotenv").config();
const express = require("express");
const sqlite3 = require("sqlite3").verbose(); // Import sqlite3
const app = express();
const cors = require("cors");
const port = process.env.PORT;
const jwt = require("jsonwebtoken"); // Import JWT
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing (if not already imported)
const JWT_SECRET = process.env.KEY; // This should be kept secure

// | API Documentation |

/*
----
GET '/' : An API check
GET '/goals' : Returns all the goals
GET '/users' : Returns all the users
GET '/get-user' : Returns a specific user, must have token
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
app.use(
  cors({
    origin: "http://localhost:3000", // allow only localhost:3000 to access the server
  })
);
app.use(express.json());

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access Denied. No Token Provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.KEY);
    req.user = decoded; // Attach the user information to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(400).json({ error: "Invalid Token or Token Expired" });
  }
}

function getUserFromToken(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access Denied. No Token Provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.KEY);
    return req.user;
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(400).json({ error: "Invalid Token or Token Expired" });
  }
}

// | GOALS |

// SQLite connection
const db = new sqlite3.Database(process.env.DB, (err) => {
  if (err) {
    console.error("Error connecting to SQLite database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Simple route to check the server
app.get("/", (req, res) => {
  res.send("Goal Tracker API is running");
});

// Route to get all goals for the authenticated user | GET
app.get("/goals", authenticateToken, (req, res) => {
  const user_id = req.user.id; // Get the user ID from the JWT payload

  // Fetch only goals that belong to the authenticated user
  const sql = "SELECT * FROM goals WHERE user_id = ?";

  db.all(sql, [user_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ goals: rows });
  });
});

// Route to add a new goal | POST
app.post("/goals", authenticateToken, (req, res) => {
  const {
    title,
    initial_value,
    current_value,
    target_value,
    unit,
    priority,
    status,
    due_date,
  } = req.body;
  const user_id = req.user.id; // User ID from the JWT payload

  // Validate user_id (should always be present now)
  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const sql = `INSERT INTO goals (user_id, title, initial_value, current_value, target_value, unit, priority, status, due_date) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(
    sql,
    [
      user_id,
      title,
      initial_value,
      current_value,
      target_value,
      unit,
      priority,
      status,
      due_date,
    ],
    function (err) {
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
          due_date,
        });
      }
    }
  );
});

// Route to update a goal | PUT
// Route to update a goal | PUT
app.put("/goals/:id", (req, res) => {
  const {
    title,
    initial_value,
    current_value,
    target_value,
    unit,
    priority,
    due_date,
  } = req.body;
  const { id } = req.params;

  // Ensure current_value does not exceed target_value
  const adjustedCurrentValue = Math.min(current_value, target_value);

  // Determine if the goal is completed
  const status =
    adjustedCurrentValue === target_value ? "completed" : "uncompleted";

  // If the status is completed, set the finished_date
  const finishedDate = status === "completed" ? new Date().toISOString() : null;

  const sql = `UPDATE goals SET title = ?, initial_value = ?, current_value = ?, target_value = ?, unit = ?, 
               priority = ?, status = ?, finished_date = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

  const values = [
    title,
    initial_value,
    adjustedCurrentValue,
    target_value,
    unit,
    priority,
    status,
    finishedDate, // Add the finished_date field
    due_date,
    id,
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
        current_value: adjustedCurrentValue,
        target_value,
        unit,
        priority,
        status,
        finished_date: finishedDate, // Include finished_date in the response
        due_date,
      });
    }
  });
});

// Route to delete a goal | DELETE
app.delete("/goals/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM goals WHERE id = ?`;

  db.run(sql, [id], function (err) {
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
app.get("/users", async (req, res) => {
  const sql = "SELECT id, name, email, created_at FROM users";

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching users: ", err);
      return res.status(500).json({ error: "Internal server error." });
    }

    res.status(200).json({ users: rows });
  });
});

// Route to get a user by ID | GET
app.get("/get-user", authenticateToken, (req, res) => {
  const { id } = req.user; // Get user ID from token (already decoded)

  const sql = "SELECT id, name, email, created_at FROM users WHERE id = ?";

  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error("Error fetching user: ", err);
      return res.status(500).json({ error: "Internal server error." });
    }

    if (!row) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ user: row }); // Send the user data in the response
  });
});

// Route to register a new user | POST
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required." });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    db.run(sql, [name, email, hashedPassword], function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed: users.email")) {
          return res.status(400).json({ error: "Email already in use." });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, name, email });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

// Route to log in a user | POST
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // Fetch user from the database by email
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error." });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // Compare the provided password with the stored hash
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: "Invalid password." });
      }

      // Password matched, create JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h", // Token will expire in 1 hour
      });

      // Send the token and user data (without the password)
      res.status(200).json({
        token, // Send the token back to the frontend
        user: {
          id: user.id,
          name: user.name, // Include the name in the response
          email: user.email,
          created_at: user.created_at,
        },
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
