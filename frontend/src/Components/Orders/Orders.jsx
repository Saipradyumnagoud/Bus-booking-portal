import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("successful");
  const [search, setSearch] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // ✅ Success message state
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
        const response = await axios.get(
          `http://localhost:3000/orders?email=${email}`
        );
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    checkLoginAndFetchOrders();
  }, [navigate]);

  const handleCancelOrder = async (orderId, orderCreatedAt) => {
    const now = new Date();
    const orderTime = new Date(orderCreatedAt);
    const timeDifference = now - orderTime;
  
    if (timeDifference > 6 * 60 * 60 * 1000) {
      alert("Order can only be canceled within 6 hours of booking.");
      return;
    }
  
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel your order?"
    );
    if (!confirmCancel) return;
  
    try {
      await axios.patch(`http://localhost:3000/orders/${orderId}/cancel`);
  
      setSuccessMessage("Order canceled successfully!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: "Cancelled" } : order
        )
      );
  
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order");
    }
  };
  

  const filterOrders = (orders, filter) => {
    const now = new Date();
  
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
  
      // Status filtering
      if (filter === "successful" && order.orderStatus !== "Successful") {
        return false;
      }
      if (filter === "pending" && order.orderStatus !== "Pending") {
        return false;
      }
      if (filter === "cancelled" && order.orderStatus !== "Cancelled") {
        return false;
      }
  
      // Time-based filtering
      switch (filter) {
        case "6hrs":
          return now - orderDate <= 6 * 60 * 60 * 1000;
        case "1day":
          return now - orderDate <= 24 * 60 * 60 * 1000;
        case "1month":
          return now - orderDate <= 30 * 24 * 60 * 60 * 1000;
        case "1year":
          return now.getFullYear() === orderDate.getFullYear();
        case "older":
          return now.getFullYear() > orderDate.getFullYear();
        default:
          return true;
      }
    });
  };

  const filteredOrders = filterOrders(orders, filter)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort latest orders first
    .filter((order) =>
      order.busId?.route.toLowerCase().includes(search.toLowerCase())
    );

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
          <li>
            <Link to="/personalinformation">Personal Information</Link>
          </li>
          <li>
            <Link to="/changepassword">Change Password</Link>
          </li>
          <li>
            <Link to="/orders">Orders</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>

      <div className="orders-wrapper">
        <div className="orders-container">
          <h1>Your Orders</h1>
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}{" "}
          {/* ✅ Success Message */}
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="orders-search-bar"
          />
          {loading ? (
            <p>Loading your orders...</p>
          ) : (
            <div className="orders-list">
              {filteredOrders.length === 0 ? (
                <p>No orders found.</p>
              ) : (
                filteredOrders.map((order) => (
                  <div className="order-card" key={order._id}>
                    <p>
                      <strong>Bus:</strong> {order.busId?.route}
                    </p>
                    <p>
                      <strong>Seats:</strong> {order.seats}
                    </p>
                    <p>
                      <strong>Total Amount:</strong> ₹{order.totalAmount}
                    </p>
                    <p>
                      <strong>Status:</strong> {order.orderStatus}
                    </p>
                    <p>
                      <strong>Created At:</strong>{" "}
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true, // Ensures AM/PM format
                      })}
                    </p>
                    {order.orderStatus !== "Cancelled" ? (
                      <button
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        padding: "10px",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => handleCancelOrder(order._id, order.createdAt)}
                    >
                      Cancel Order
                    </button>
                    
                    ) : (
                      <p className="cancelled-text">Order Cancelled</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="filters">
          <h3>Filters</h3>
          <label>Status</label>
          <button onClick={() => setFilter("successful")}>Successful</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
          <button onClick={() => setFilter("cancelled")}>Cancelled</button>
          <button onClick={() => setFilter("showallorders")}>Show all orders</button>

          <h3>Order Time</h3>
          <button onClick={() => setFilter("6hrs")}>Last 6 Hours</button>
          <button onClick={() => setFilter("1month")}>Last 30 Days</button>
          <button onClick={() => setFilter("1year")}>2024</button>
          <button onClick={() => setFilter("older")}>Older</button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
