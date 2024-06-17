const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Hello,preety World!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:	{port}`);
});
