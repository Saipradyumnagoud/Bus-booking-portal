const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const PassengerModel = require('./models/Passenger');
const BusModel = require('./models/busModel');
const OrderModel = require('./models/Order');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

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

// Buses Route
app.get('/api/buses', async (req, res) => {
  try {
    const buses = await BusModel.find(); // Fetch all buses from the database
    res.json(buses); // Return the buses in the response
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({ message: 'Error fetching buses data' });
  }
});

// Orders Route (Fetching Orders)
app.get('/orders', async (req, res) => {
  const email = req.query.email;

  try {
    const user = await PassengerModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const orders = await OrderModel.find({ userId: user._id }).populate('busId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Orders Route (Creating an Order)
app.post('/orders', async (req, res) => {
  const { email, busId, seats, totalAmount } = req.body;

  try {
    const user = await PassengerModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newOrder = await OrderModel.create({
      userId: user._id,
      busId,
      seats,
      totalAmount,
    });

    res.json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});