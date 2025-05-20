import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PropertyDetails from "./pages/PropertyDetails";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AddProperty from "./pages/AddProperty";
import PaymentPage from "./pages/PaymentPage";
import FooterBottom from "./components/FooterBottom";
import Host from "./pages/Host";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/property/:propertyId" element={<PropertyDetails />} />
        <Route path="/host" element={ <Host/> }/>
        <Route path="/add-property" element={<PrivateRoute><AddProperty /></PrivateRoute>} />
        <Route path="/category/:category" element={<Dashboard />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
      <FooterBottom />
    </Router>
  );
}

export default App;
