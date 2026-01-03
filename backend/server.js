// server.js
const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env;

app.get('/', (req, res) => {
  res.send('Hello World from Node.js!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
