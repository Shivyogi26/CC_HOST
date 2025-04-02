
// File: server.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// MySQL connection
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

// Connect to the database
con.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        process.exit(1);
    }
    console.log("Connected to the database!");
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Add Student
app.post('/addStudent', (req, res) => {
    const { student_id, name, roll_no, usn, dob, address } = req.body;
    if (!student_id || !name || !roll_no || !usn || !dob || !address) {
        return res.status(400).send("<p>All fields are required!</p>");
    }
    const query = "INSERT INTO students (student_id, name, roll_no, usn, dob, address) VALUES (?, ?, ?, ?, ?, ?)";
    con.query(query, [student_id, name, roll_no, usn, dob, address], (err) => {
        if (err) {
            console.error("Error adding student:", err);
            return res.status(500).send("<p>Error adding student!</p>");
        }
        res.send("<p>Student added successfully!</p>");
    });
});

// Add Course
app.post('/addCourse', (req, res) => {
    const { course_id, course_name, credits } = req.body;
    if (!course_id || !course_name || !credits) {
        return res.status(400).send("<p>All fields are required!</p>");
    }
    const query = "INSERT INTO courses (course_id, course_name, credits) VALUES (?, ?, ?)";
    con.query(query, [course_id, course_name, credits], (err) => {
        if (err) {
            console.error("Error adding course:", err);
            return res.status(500).send("<p>Error adding course!</p>");
        }
        res.send("<p>Course added successfully!</p>");
    });
});

// Enroll Student in Course
app.post('/enrollStudent', (req, res) => {
    const { student_id, course_id } = req.body;
    if (!student_id || !course_id) {
        return res.status(400).send("<p>Both student_id and course_id are required!</p>");
    }
    const query = "INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)";
    con.query(query, [student_id, course_id], (err) => {
        if (err) {
            console.error("Error enrolling student:", err);
            return res.status(500).send("<p>Error enrolling student!</p>");
        }
        res.send("<p>Student enrolled successfully!</p>");
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
