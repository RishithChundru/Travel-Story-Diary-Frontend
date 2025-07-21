import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import image from "../assets/image.png"; 

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const { email, password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            toast.error(message || 'Login failed. Please check your credentials.');
        }

        if (isSuccess) {
            toast.success('Login successful!');
            navigate('/');
        }

        dispatch(reset());
    }, [isError, isSuccess, message, navigate, dispatch]);

    const handleChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = { email, password };
        dispatch(login(userData));
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-blue-50 font-inter">
                <p className="text-lg font-medium text-blue-700">Loading...</p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-blue-50 flex items-center justify-center p-4 font-inter overflow-hidden">
            <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-4xl">
                <div
                    className="md:w-1/2 w-full h-64 md:h-140 bg-cover bg-center flex items-end p-6 md:rounded-l-lg md:rounded-r-none rounded-t-lg"
                    style={{ backgroundImage: `url(${image})` }}
                >
                    <div className="bg-black/40 p-4 rounded-lg text-white">
                        <h4 className="text-3xl md:text-4xl font-semibold leading-tight">
                            Create Your <br /> Travel Stories
                        </h4>
                        <p className="text-sm md:text-base leading-relaxed mt-3">
                            Record your travel experiences and memories in your travel journey
                        </p>
                    </div>
                </div>
                <div className="md:w-1/2 w-full p-8 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-200 ease-in-out"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={handleChange}
                                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-200 ease-in-out"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <button
                                type="submit"
                                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline w-full transition duration-200 ease-in-out transform hover:scale-105"
                            >
                                Login
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-gray-600 text-sm mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-orange-600 hover:text-orange-800 font-semibold transition duration-200 ease-in-out">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;