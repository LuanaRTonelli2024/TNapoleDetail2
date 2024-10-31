//src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./components/login";
import Homepage from "./components/homepage";
import OurServices from "./components/ourservices";
import AboutUs from "./components/aboutus";
import ContactUs from "./components/contactus";
import ResetPassword from "./components/resetpassword";
import Signup from "./components/signup";
import Dashboard from "./components/dashboard";
import Profile from "./components/profile";
import Vehicles from "./components/vehicles";
import ServiceHistory from "./components/servicehistory";
import Booking from "./components/booking";
import ChangePassword from "./components/changepassword";
import BookingSettings from "./components/bookingsettings";
import AdminDashboard from "./components/admindashboard";
import AdminCustomers from "./components/admincustomers";
import AdminLogin from "./components/adminlogin";
import AdminEmployees from "./components/adminemployees";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/ourservices" element={<OurServices />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/servicehistory" element={<ServiceHistory />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/booksettings" element={<BookingSettings />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/admincustomers" element={<AdminCustomers />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/adminemployees" element={<AdminEmployees />} /> 
      </Routes>
    </Router>
  );
}

export default App;
 

