import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import UserDashboard from "./components/UserDashboard";
//import Register from "./components/Register";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<UserDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
