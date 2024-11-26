//src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
//import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./components/login";
import Homepage from "./components/homepage";
import OurServices from "./components/ourservices";
import AboutUs from "./components/aboutus";
import ContactUs from "./components/contactus";
import ResetPassword from "./components/resetpassword";
import Signup from "./components/signup";
import Dashboard from "./components/customerdashboard";
import Profile from "./components/customerprofile";
import Vehicles from "./components/customervehicles";
import AppointmentsHistory from "./components/appointmentshistory";
import ServiceHistory from "./components/customerservicehistory";
import Booking from "./components/customerbooking";
import ChangePassword from "./components/changepassword";
import AdminDashboard from "./components/admindashboard";
import AdminCustomers from "./components/admincustomers";
import AdminEmployees from "./components/adminemployees";
import AdminTechnicians from "./components/admintechnicians";
import AdminServices from "./components/adminservices";
import AdminCalendar from "./components/admincalendar";
import AdminAppointments from "./components/adminappointments";
import TechnicianDashboard from "./components/techniciandashboard";
import TechnicianConfirmService from "./components/technicianconfirmservice";
import PaymentLink from "./components/paymentlink";

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
        <Route path="/appointments-history" element={<AppointmentsHistory />} />
        <Route path="/servicehistory" element={<ServiceHistory />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/admincustomers" element={<AdminCustomers />} />
        <Route path="/adminemployees" element={<AdminEmployees />} />
        <Route path="/admintechnicians" element={<AdminTechnicians />} />
        <Route path="/adminservices" element={<AdminServices />} />
        <Route path="/adminappointments" element={<AdminAppointments />} />
        <Route path="/techniciandashboard" element={<TechnicianDashboard />} />
        <Route path="/technicianconfirmservice" element={<TechnicianConfirmService />} />
        <Route path="/admincalendar" element={<AdminCalendar />} />
        <Route path="/paymentlink" element={<PaymentLink />} />
      </Routes>
    </Router>
  );
}

export default App;
 

