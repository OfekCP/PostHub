import React from 'react';
import { useForm } from 'react-hook-form';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
import './Registration.css'
const Registration = () => {
    const Nav=useNavigate()
    const { register, handleSubmit, errors } = useForm();
    const { login } = useUser();

    const onSubmit = (data) => {
        if (data.username && data.email && data.password) {
            const userData = {
                username: data.username,
                email: data.email,
                password: data.password,
            };
            localStorage.setItem(`users/${userData.username}`, JSON.stringify(userData));
        }
Nav('/login')
    };

    return (
        <div id="registration-container">
            <h2 id="registration-heading">Register</h2>
            <form id="registration-form" onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    {...register('username', { required: true })}
                    id="username-input"
                    className="registration-input"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    {...register('email', { required: true })}
                    id="email-input"
                    className="registration-input"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    {...register('password', { required: true })}
                    id="password-input"
                    className="registration-input"
                />
                <button type="submit" id="registration-button" className="registration-button">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Registration;
