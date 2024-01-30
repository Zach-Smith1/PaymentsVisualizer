const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;
const secretKey = 'your secret key'; // Shared with the Auth Server
let isAuthenticated = false;

// Middleware to validate incoming tokens from the URL
const authenticateMiddleware = (req, res, next) => {
  const token = req.query.token; // Get token from the query parameter
  if (!token) {
    return res.redirect('https://login.eaasystart.com');
  }

  try {
    // Verify token using the shared secret key
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    isAuthenticated = true; // Set the authentication flag
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

app.use('/public', express.static(path.join(__dirname, 'public')));

// Protected endpoint in the main application
app.get('/', authenticateMiddleware, (req, res) => {
  // If the middleware passes (token is valid), provide access to the application
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


// Serve static files from the 'dist' directory only if authenticated
app.use((req, res, next) => {
  if (isAuthenticated) {
    express.static(path.join(__dirname, 'dist'))(req, res, next);
  } else {
    res.status(401).send('Unauthorized - User not authenticated, please login at login.eaasystart.com');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
