import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };


    return (
        <nav className="bg-orange-600 p-4 h-20 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">
                    Travel Diary
                </Link>
                <div>
                    {user ? (
                        <ul className="flex space-x-4 items-center">
                            <li className="font-semibold">Hello, {user.username ? user.username : (user.email ? user.email.split('@')[0] : 'User')}!

                            </li>
                            <li>
                                <button
                                    onClick={onLogout}
                                    className="bg-green-500 hover:bg-green-600 text-black border-black-100 py-1 px-3 rounded transition-colors"
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    ) : (
                        <ul className="flex space-x-4">
                            <li>
                                <Link to="/login" className="bg-white text-orange-600 py-2 px-4 rounded-md transition-colors duration-200 font-semibold shadow-sm">Login</Link>
                            </li>
                            <li>
                                <Link to="/register" className="bg-white text-orange-600 py-2 px-4 rounded-md transition-colors duration-200 font-semibold shadow-sm">Register</Link>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;