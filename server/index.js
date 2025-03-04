const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const PassengerModel = require("./models/Passenger");
const BusModel = require("./models/busModel");
const OrderModel = require("./models/Order");

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

// ✅ Signup Route
app.post("/signup", async (req, res) => {
  const { name, email, password, gender, mobile } = req.body;

  if (!name || !email || !password || !gender || !mobile) {
    return res.status(400).json({ error: "Please provide all fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await PassengerModel.create({
      name,
      email,
      password: hashedPassword,
      gender,
      mobile,
    });
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Error creating user", err });
  }
});

// ✅ Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await PassengerModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.json({ message: "Success" });
    } else {
      res.status(400).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get User Details
app.get("/userDetails", async (req, res) => {
  const email = req.query.email;

  try {
    const user = await PassengerModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      gender: user.gender,
      mobile: user.mobile,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user details" });
  }
});

// ✅ Update User Details
app.put("/userDetails/:email", async (req, res) => {
  const { email } = req.params;
  const { name, gender, mobile } = req.body;

  try {
    const updatedUser = await PassengerModel.findOneAndUpdate(
      { email },
      { name, gender, mobile },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User details updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user details" });
  }
});

// ✅ Delete User
app.delete("/userDetails/:email", async (req, res) => {
  try {
    const deletedUser = await PassengerModel.findOneAndDelete({
      email: req.params.email,
    });
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

// ✅ Fetch all buses
app.get("/api/buses", async (req, res) => {
  try {
    const buses = await BusModel.find();
    res.json(buses);
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ message: "Error fetching buses data" });
  }
});

// ✅ Fetch orders for a user
app.get("/orders", async (req, res) => {
  const email = req.query.email;

  try {
    const user = await PassengerModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const orders = await OrderModel.find({ userId: user._id }).populate("busId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ✅ Create an order
app.post("/orders", async (req, res) => {
  const { email, busId, seats, totalAmount, selectedSeats, travelers, bookingDate } = req.body;

  try {
    // Validate required fields
    if (!email || !busId || !seats || !totalAmount || !selectedSeats.length || !travelers.length || !bookingDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find the user by email
    const user = await PassengerModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create new order
    const newOrder = await OrderModel.create({
      userId: user._id,
      busId,
      seats,
      totalAmount,
      selectedSeats,
      travelers,
      bookingDate,
      orderStatus: "Successful",
    });

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// ✅ Cancel an order
app.patch("/orders/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;

    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update order status to "Cancelled"
    order.orderStatus = "Cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully!", order });
  } catch (error) {
    console.error("Error canceling order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Change Password
app.post("/changePassword", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await PassengerModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect old password" });
    }

    // Hash the new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating password" });
  }
});

// ✅ Start the server
app.listen(3000, () => {
  console.log("🚀 Server is running on port 3000 and accessible on the local network");
});
