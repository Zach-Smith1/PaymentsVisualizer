const { arMiddleware, cookieParser, fullLogout, requireLogin } = require('@authrocket/authrocket-middleware');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
// Other middleware and routes...
app.use(cookieParser())
app.use('/logout', fullLogout)
app.use('/login', arMiddleware({
  authrocket: {
    loginrocketUrl: 'https://valid-prize-5f87.e2.loginrocket.com/'
  }
}))
app.use(requireLogin)
// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Route for the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
