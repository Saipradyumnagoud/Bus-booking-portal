import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home.jsx";
import About from "./Components/About/About.jsx";
import Contact from "./Components/Contact/Contact.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import Buses from "./Components/Busses/Buses.jsx";
import Services from "./Components/Services/Services.jsx";
import CancellationPolicies from "./Components/Cancellation/CancellationPolicies.jsx";
import TravelInsurance from "./Components/Travel/TravelInsurance.jsx";
import Offers from "./Components/Offers/Offers.jsx";
import Signup from "./Components/Signup/Signup.jsx";
import Login from "./Components/Login/Login.jsx";
import BookNow from "./Components/Booknow/Booknow.jsx";
import MyAccount from "./Components/MyAccount/MyAccount.jsx";
import ChangePassword from "./Components/ChangePassword/ChangePassword.jsx";
const App = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/buses" element={<Buses />} />
          <Route path="/services" element={<Services />} />
          <Route path="/cancellationpolicies" element={<CancellationPolicies />} />
          <Route path="/travelinsurance" element={<TravelInsurance />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/booknow" element={<BookNow />} />
          <Route path="/myaccount" element={<MyAccount />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
