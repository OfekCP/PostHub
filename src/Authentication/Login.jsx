import React from 'react';
import { useForm } from 'react-hook-form';
import { useUser } from './UserContext'; 
import {useNavigate} from 'react-router-dom'
import './Login.css'
const Login = () => {
    const Nav=useNavigate()
    const { register, handleSubmit, errors } = useForm();
    const { login } = useUser(); 

    const onSubmit = (data) => {
        const userData = JSON.parse(localStorage.getItem(`users/${data.username}`));

        if (userData && userData.password === data.password) {
            login(userData);
        } else {
            alert('Invalid username or password. Please sign up first.');
        }
        Nav('/')
    };

    return (
        <div id="login-container">
            <h2 id="login-heading">Login</h2>
            <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
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
