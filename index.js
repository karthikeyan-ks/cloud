const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Hello, World! Your Express server is running.');
});

// Export the app so the test file can use it
module.exports = app;