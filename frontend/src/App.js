import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { decodeToken, isExpired } from 'react-jwt';
import Login from './Components/Auth/Login';
import MerchantLayout from './Components/Merchant/Layout';
import config from './config';
import Inventory from './Components/Merchant/Inventory';
import CustomerLayout from './Components/Customer/Layout';
import MerchantDashboard from './Components/Merchant/Dashboard';
import CustomerDashboard from './Components/Customer/Dashboard';

function App() {
	// localStorage.clear()

	const decodedToken = decodeToken(config.TOKEN); 

	const isTokenExpired = isExpired(config.TOKEN); 
	const isMerchant = !isTokenExpired && decodedToken?.userType === 'merchant';
	const isCustomer = !isTokenExpired && decodedToken?.userType === 'customer';

	return (
		<div className="wrapper">
			<BrowserRouter>
				<Routes>
					<Route path="merchant" element={ isMerchant ? <MerchantLayout/> : <Navigate to='/login' /> }>
						<Route path="dashboard" element={<MerchantDashboard />} />
						<Route path="inventory" element={<Inventory />} />
					</Route>
					<Route path="customer" element={ isCustomer ? <CustomerLayout/> : <Navigate to='/login' /> }>
						<Route path="dashboard" element={<CustomerDashboard />} />
						<Route path="inventory" element={<Inventory />} />
					</Route>
					<Route path="login" element={<Login />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}


export default App;
