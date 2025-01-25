const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const PassengerModel = require('./models/Passenger');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/passenger", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Signup Route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide all fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await PassengerModel.create({ name, email, password: hashedPassword });
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Error creating user', err });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await PassengerModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.json({ message: 'Success' });
    } else {
      res.status(400).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User Details Route
app.get('/userDetails', async (req, res) => {
  const email = req.query.email;

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
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// Change Password Route
app.post('/changePassword', async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    const user = await PassengerModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect old password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error changing password' });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
