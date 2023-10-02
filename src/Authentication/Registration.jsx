import React from 'react';
import { useForm } from 'react-hook-form';
import { useUser } from './UserContext'; // Import the UserContext
import { useNavigate } from 'react-router-dom';
import './Registration.css'
const Registration = () => {
    const Nav=useNavigate()
    const { register, handleSubmit, errors } = useForm();
    const { login } = useUser(); // Access the login function from UserContext

    const onSubmit = (data) => {
        // Handle registration logic here
        // Example: Validate the data and store it in local storage
        if (data.username && data.email && data.password) {
            const userData = {
                username: data.username,
                email: data.email,
                password: data.password,
            };

            // Save user data in the specified local storage pattern
            localStorage.setItem(`users/${userData.username}`, JSON.stringify(userData));

            // Don't log in the user here
        }
Nav('/login')
    };

    return (
        <div id="registration-container">
            <h2 id="registration-heading">Register</h2>
            <form id="registration-form" onSubmit={handleSubmit(onSubmit)}>
                {/* Username field */}
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
