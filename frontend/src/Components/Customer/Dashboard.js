import React, { useState } from 'react';
import Login from '../Auth/Login';

export default function Dashboard() {
    const [token, setToken] = useState();
    return(
        <h2>Dashboard</h2>
    );
}