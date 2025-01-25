import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
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

    fetchOrders();
  }, []);

  return (
    <div className="orders-container">
      <h1>Your Orders</h1>
      {loading ? (
        <p>Loading your orders...</p>
      ) : (
        <div className="orders-list">
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order) => (
              <div className="order-card" key={order._id}>
                <p><strong>Bus:</strong> {order.busId?.name}</p>
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
  );
};

export default Orders;
