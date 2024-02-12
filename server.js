const express = require('express');
const routes = require('./routes/index');

// Create an instance of Express
const app = express();

// Define the port from the env variable
const PORT = process.env.PORT || 5000;

// Load all routes from routes
app.use('/', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
