import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/">
            <h1 className="navbar-brand">BookNow</h1>
          </Link>
        </div>
        <div className="navbar-right">
          <div className="hamburger" onClick={toggleMobileMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
        <div className={`navbar-center ${isMobileMenuOpen ? "open" : ""}`}>
          <ul className="nav-links">
            <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
            <li><Link to="/buses" onClick={() => setMobileMenuOpen(false)}>Buses</Link></li>
            <li className="dropdown">
              <Link to="/services" onClick={() => setMobileMenuOpen(false)}>Services</Link>
              <div className="dropdown-menu">
                <Link to="/cancellationpolicies" onClick={() => setMobileMenuOpen(false)}>Cancellation Policy</Link>
                <Link to="/travelinsurance" onClick={() => setMobileMenuOpen(false)}>Travel Insurance</Link>
                <Link to="/offers" onClick={() => setMobileMenuOpen(false)}>Offers</Link>
              </div>
            </li>
            <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
            <li><Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link></li>
          </ul>
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
