const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const mysql = require('mysql');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'test'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id', connection.threadId);
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Vulnerable endpoint
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = `SELECT * FROM users WHERE id = ${mysql.escape(userId)}`; // Still vulnerable to SQL injection
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
