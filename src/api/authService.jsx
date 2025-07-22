import axios from 'axios';

require("dotenv").config()
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Register
const register = async (userData) => {
    const response = await axios.post(`${API_URL}/api/auth/signup`, userData);
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// Login
const login = async (userData) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, userData);
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// Logout
const logout = () => {
    localStorage.removeItem('user');
};

const authService = {
    register,
    login,
    logout,
};

export default authService;