// Ranbir Singh Deol
// Last Updated: Jan 1, 2025
// Server-side code for the Goal Tracker app

require("dotenv").config();
const express = require("express");
const sqlite3 = require("sqlite3").verbose(); // Import sqlite3
const app = express();
const cors = require("cors");
const port = process.env.PORT;
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken"); // Import JWT
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing (if not already imported)
const JWT_SECRET = process.env.KEY; // This should be kept secure
const uploadsPath = path.join(__dirname, "../frontend/src/images/uploads");

// | API Documentation |

/*

|USERS|

GET '/users' : Returns all the users

GET '/get-user' : Returns a specific user, must have token

POST '/register' : Registers a new user

POST '/login' : Logs in a user

|GOALS|

GET '/goals' : Returns all the goals

POST '/goals' : Adds a new goal

PUT '/goals/:id' : Updates a goal, all fields required

DELETE '/goals/:id' : Deletes a goal

|PROJECTS|

GET '/projects': Returns all the projects

POST '/projects': Creates a new project

PUT '/projects/:id': Updates a project

DELETE '/projects/:id': Deletes a project

*/

// | MIDDLEWARE |

// Middleware to parse JSON
app.use(
  cors({
    origin: "http://localhost:3000", // allow only localhost:3000 to access the server
  })
);
app.use(express.json());
app.use("/uploads", express.static(uploadsPath));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath); // Store uploaded images in the "uploads" folder
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname); // Get file extension
    cb(null, Date.now() + fileExtension); // Generate unique filename based on timestamp
  },
});
const upload = multer({ storage: storage });

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
  } = req.body;
  const user_id = req.user.id; // User ID from the JWT payload

  // Validate user_id (should always be present now)
  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  // Incrementing our due_date by one, since SQLite stores it one day behind?!

  // Convert due_date to a Date object
  let dueDate = new Date(req.body.due_date);

  // Subtract one day (24 hours)
  dueDate.setDate(dueDate.getDate() + 1);

  // Format the date to 'YYYY-MM-DD' format
  const formattedDueDate = dueDate.toISOString().split("T")[0];
  due_date = formattedDueDate;

  // Prepare the SQL query
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

// | PROJECTS |

// |GET|: [/projects]: Returns all of our project.
app.get("/projects", (req, res) => {
  // Insert all projects into a list
  db.all("SELECT * FROM projects", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Return as JSON
    res.json({ projects: rows });
  });
});

// |POST|: [/projects]: Creating a Project
app.post("/projects", authenticateToken, upload.single("image"), (req, res) => {
  const user_id = req.user.id; // Get user ID from JWT payload
  const { title, date_created, link } = req.body;

  const image = req.file ? req.file.filename : "";

  const now = new Date().toISOString();
  const formattedDate = date_created || now;

  const query = `
    INSERT INTO projects (user_id, title, date_created, image, link)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [user_id, title, formattedDate, image, link], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      id: this.lastID,
      user_id,
      title,
      date_created: formattedDate,
      image,
      link,
    });
  });
});

// |PUT|: [/projects/:id]: Edits a project within the database
app.put(
  "/projects/:id",
  authenticateToken,
  upload.single("image"),
  (req, res) => {
    const { id } = req.params;
    const { title, date_created, link } = req.body;
    const image = req.file ? req.file.filename : req.body.image; // Only update image if a new one is provided

    const query = `
    UPDATE projects
    SET title = ?, date_created = ?, image = COALESCE(?, image), link = ?
    WHERE id = ? AND user_id = ?
  `;

    db.run(
      query,
      [title, date_created, image, link, id, req.user.id],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.status(200).json({
          id,
          title,
          date_created,
          image: image || null,
          link,
        });
      }
    );
  }
);

// |DELETE|: [/projects/:id]: Deletes a project using its ID
app.delete("/projects/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM projects WHERE id = ?";

  db.run(query, [id], function (err) {
    if (err) {
      console.log("Error deleting project:", err.message);
      return res.status(500).json({ error: "Failed to delete project" });
    }

    // Check if the row exists
    if (this.changes == 0) {
      return res
        .status(404)
        .json({ message: "No project found with given ID" });
    }

    console.log(`Project with ID ${id} deleted succesfully`);
    res.json({ message: `Project with ID ${id} deleted successfully` });
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
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

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
