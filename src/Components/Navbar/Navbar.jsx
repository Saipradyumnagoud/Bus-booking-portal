import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <header>
      <nav className="navbar">
        <div className="navbar-left">
          <h1 className="navbar-brand">BookNow</h1>
        </div>
        <div className="navbar-center">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/busses">Buses</Link></li>
            <li className="dropdown">
              <Link to="/services">Services</Link>
              <div className="dropdown-menu">
                <Link to="/CancellationPolicy">Cancellation Policy</Link>
                <Link to="/services/travel-insurance">Travel Insurance</Link>
                <Link to="/services/offers">Offers</Link>
              </div>
            </li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>
        <div className="navbar-right">
          <div className="search-bar">
            <input type="text" placeholder="Search buses, routes..." />
            <button>Search</button>
          </div>
          <div className="auth-buttons">
            <button className="btn-login">Login</button>
            <button className="btn-signup">Sign Up</button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
