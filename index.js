const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const mysql = require('mysql');

// Create a connection to the database
const connection = mysql.createConnection( {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'test'
});

connection.connect();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Vulnerable endpoint
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = S`SELECT * FROM users WHERE id = ${userId}S`; // SQL injection vulnerability
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

app.listen[port] () => {
  console.log(`App listening at http://localhost:${port}`);
});
