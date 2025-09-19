import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
const salt = 10;


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [process.env.CLIENT_ORIGIN],
    methods: ["POST", "GET"],
    credentials: true
  }));

  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

db.query("SELECT DATABASE() AS db;", (err, result) => {
    if (err) {
      console.error("Error checking DB:", err.message);
    } else {
      console.log("🎯 Connected to database:", result[0].db);
    }
  });

// ///start
// const isql = "INSERT INTO customer (name, email, password) VALUES (?, ?, ?)";
// const values = ['Test User', 'test@example.com', 'hashedpassword'];

// db.query(isql, values, (err, result) => {
//   if (err) {
//     console.error("Insert error:", err.message);
//   } else {
//     console.log("Insert successful, ID:", result.insertId);
//   }
// });
// ///end    

const verifyUser = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ ok: false, error: "Cookie not found" });
    }
    const secret = process.env.JWT_SECRET || 'secret-key';
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.error("JWT verify error:", err?.message);
        return res.status(401).json({ ok: false, error: "Invalid token" });
      }
      req.name = decoded?.name;
      next();
    });
  } catch (e) {
    console.error("verifyUser exception:", e);
    return res.status(500).json({ ok: false, error: "Internal error (verifyUser)" });
  }
};

app.get('/', verifyUser, (req, res) => {
    return res.json({ Status: "User is registered successfully", name: req.name });
  });

app.post('/login', (req, res) => {
  const sql = "SELECT * FROM customer WHERE email = ?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.json({ Error: "Login error in server" });
    if (data.length === 0) return res.json({ Error: "Invalid email or password" });

    bcrypt.compare(req.body.password.toString(), data[0].password, (err, ok) => {
      if (err) return res.json({ Error: "Password compare error" });
      if (!ok) return res.json({ Error: "Invalid password" });

      const name = data[0].name;
      const token = jwt.sign({ name }, 'secret-key', { expiresIn: '1h' });
      // httpOnly so it’s not readable by JS
      res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
      return res.json({ Status: "User is registered successfully" });
    });
  });
});

// app.post('/signup', (req, res) => {
//     const sql = "INSERT INTO customer (`name`,`email`,`password`) VALUES (?)";
//     bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
//       if (err) return res.json({ Error: "for hashing password" });
//       const values = [req.body.name, req.body.email, hash];
//       db.query(sql, [values], (err) => {
//         if (err) return res.json({ Error: "inserting data Error in server" });
//         return res.json({ Status: "User is registered successfully" });
//       });
//     });
//   });
  


app.post('/signup', (req, res) => {

    const sql = "INSERT INTO customer (`name`,`email`,`password`) VALUES (?)"; // ✅ match your /login table
    const saltRounds = 10;
  
    bcrypt.hash(req.body.password.toString(), saltRounds, (err, hash) => {
      if (err) {
        console.error("Hash error:", err.message);
        return res.json({ Error: "Error hashing password" });
      }
  
      const values = [req.body.name, req.body.email, hash];
      db.query(sql, [values], (err) => {
        if (err) {
          console.error("Signup DB Error:", err.message);
          return res.json({ Error: err.message });
        }
        return res.json({ Status: "User is registered successfully" });
      });
    });
  });
  

app.listen(process.env.PORT, () => {
    console.log(`🚀 server is running on port ${process.env.PORT}`);
});