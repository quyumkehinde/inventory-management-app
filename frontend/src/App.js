import { useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useJwt } from "react-jwt";
import Login from "./Components/Auth/Login";
import { default as CustomerDashboard } from "./Components/Customer/Dashboard";
import Orders from "./Components/Customer/Orders";

function App() {
  const { decodedToken, isExpired } = useJwt();
  console.log(decodedToken);
  return (
    <div className="wrapper">
      <h1>Application</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/customer" element={ isExpired && <Navigate to="/login" /> }>
            <Route path="dashboard" element={<CustomerDashboard />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;
