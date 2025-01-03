import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <header>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/">
            <h1 className="navbar-brand">BookNow</h1>
          </Link>
        </div>
        <div className="navbar-center">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/buses">Buses</Link></li>
            <li className="dropdown">
              <Link to="/services">Services</Link>
              <div className="dropdown-menu">
                <Link to="/cancellationpolicies">Cancellation Policy</Link>
                <Link to="/travelinsurance">Travel Insurance</Link>
                <Link to="/offers">Offers</Link>
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
            <Link to="/myaccount">
              <button className="btn-account">My Account</button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
