import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Components/Home/Home.jsx";
import About from "./Components/About/About.jsx";
import Contact from "./Components/Contact/Contact.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import Buses from "./Components/Busses/Buses.jsx";
import Services from "./Components/Services/Services.jsx";
import CancellationPolicies from "./Components/Cancellation/CancellationPolicies.jsx";

const App = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/busses" element={<Buses />} />
          <Route path="/services" element={<Services />}/>
          <Route path="/cancellationpolicies" element={<CancellationPolicies />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;