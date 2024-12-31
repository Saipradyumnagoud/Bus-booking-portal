const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const PassengerModel = require('./models/Passenger');
const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/passenger", { useNewUrlParser: true, useUnifiedTopology: true });

// Routes

// Signup Route
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide all fields' });
  }

  // Create new user
  PassengerModel.create({ name, email, password })
    .then(passenger => res.json(passenger))
    .catch(err => res.status(500).json({ error: 'Error creating user', err }));
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await PassengerModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check if password matches
    if (user.password === password) {
      res.json({ message: 'Success' });
    } else {
      res.status(400).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User Details Route
app.get('/userDetails', async (req, res) => {
  const email = req.query.email; // Email can be passed as a query parameter

  try {
    const user = await PassengerModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
