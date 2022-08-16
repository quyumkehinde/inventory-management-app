import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { decodeToken, isExpired, useJwt } from "react-jwt";
import Login from "./Components/Auth/Login";
import { default as CustomerDashboard } from "./Components/Customer/Dashboard";
import Orders from "./Components/Customer/Orders";
import config from "./config";

function App() {
  // localStorage.clear()
  const decodedToken = decodeToken(config.TOKEN); 

  const isTokenExpired = isExpired(config.TOKEN); 
  const isCustomer = decodedToken?.userType === 'customer';
  return (
    <div className="wrapper">
      <h1 className='p-4 bg-gray-100 mb-10'>Dukka</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/customer" element={ (isTokenExpired || !isCustomer) && <Navigate to="/" /> }>
            <Route path="dashboard" element={<CustomerDashboard />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;
