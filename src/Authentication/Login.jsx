import React from 'react';
import { useForm } from 'react-hook-form';
import { useUser } from './UserContext'; // Import the UserContext
import {useNavigate} from 'react-router-dom'
import './Login.css'
const Login = () => {
    const Nav=useNavigate()
    const { register, handleSubmit, errors } = useForm();
    const { login } = useUser(); // Access the login function from UserContext

    const onSubmit = (data) => {
        // Check if the user exists in local storage
        const userData = JSON.parse(localStorage.getItem(`users/${data.username}`));

        if (userData && userData.password === data.password) {
            // User exists and password is correct, so allow login
            login(userData);
        } else {
            // User doesn't exist or password is incorrect
            alert('Invalid username or password. Please sign up first.');
        }
        Nav('/')
    };

    return (
        <div id="login-container">
            <h2 id="login-heading">Login</h2>
            <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
                {/* Username field */}
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    {...register('username', { required: true })}
                    id="username-input"
                    className="login-input"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    {...register('password', { required: true })}
                    id="password-input"
                    className="login-input"
                />
                <button type="submit" id="login-button" className="login-button">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
