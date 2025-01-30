import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginAndFetchOrders = async () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (!isLoggedIn) {
        navigate("/login");
        return;
      }
      const email = localStorage.getItem("userEmail");
      try {
        const response = await axios.get(`http://localhost:3000/orders?email=${email}`);
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    checkLoginAndFetchOrders();
  }, [navigate]);

  const filterOrders = (orders, filter) => {
    const now = new Date();
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      switch (filter) {
        case "6hrs":
          return now - orderDate <= 6 * 60 * 60 * 1000;
        case "1day":
          return now - orderDate <= 24 * 60 * 60 * 1000;
        case "1month":
          return now - orderDate <= 30 * 24 * 60 * 60 * 1000;
        case "1year":
          return now - orderDate <= 365 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });
  };

  const filteredOrders = filterOrders(orders, filter);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="account-container">
      <div className="sidebar">
        <h3>Account</h3>
        <ul>
          <li><Link to="/personalinformation">Personal Information</Link></li>
          <li><Link to="/changepassword">Change Password</Link></li>
          <li><Link to="/orders">Orders</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>
      <div className="orders-container">
        <h1>Your Orders</h1>
        <label>Filter by time:</label>
        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option value="all">All</option>
          <option value="6hrs">Last 6 Hours</option>
          <option value="1day">Last 1 Day</option>
          <option value="1month">Last 1 Month</option>
          <option value="1year">Last 1 Year</option>
        </select>
        {loading ? (
          <p>Loading your orders...</p>
        ) : (
          <div className="orders-list">
            {filteredOrders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              filteredOrders.map((order) => (
                <div className="order-card" key={order._id}>
                  <p><strong>Bus:</strong> {order.busId?.route}</p>
                  <p><strong>Seats:</strong> {order.seats}</p>
                  <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
                  <p><strong>Status:</strong> {order.orderStatus}</p>
                  <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;