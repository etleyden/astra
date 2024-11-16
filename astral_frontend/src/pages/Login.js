import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import "./Login.css";

function Login() {
    const saltRounds = 10; // Adjust cost factor as needed
    // Initialize state to store form data
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
 
    // Update state on input change
    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Submit form data
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        try {
        // Here, you can submit data to a backend
            console.log('Form submitted:', formData);
            const hashedPassword = await bcrypt.hash(formData.password, saltRounds);

            const submissionData = {
                ...formData,
                password: hashedPassword
            }
            // Example: sending data to a backend API
            fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submissionData)
            })
                .then(response => {        // Log the response body as text before parsing
                    return response.text().then(text => {
                        console.log('Response Text:', text);
                        try {
                            return JSON.parse(text);
                        } catch (error) {
                            throw new Error('Response is not valid JSON');
                        }
                    });
                })
                .then(data => console.log('Success:', data))
                .catch(error => console.error('Error:', error));
        } catch (e) {
            console.error("Error hashing password: ", e);
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center vh-100">
            <form className="mx-auto p-5 shadow" id="loginForm"  onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div className="form-group">
                    <input type="text" className="form-control mt-3" id="emailLogin" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                </div>
                <div className="form-group">
                    <input type="text" className="form-control mt-3" id="passwordLogin" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                </div>
                <div className="d-flex justify-content-between mt-3">
                    <button type="submit" className="btn btn-primary">Submit</button>
                    <a href="/register" className="regLink">Register</a>
                </div>
            </form>
        </div>
    );
}

export default Login;
