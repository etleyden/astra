import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import './Login.css';

function Register() {
    const saltRounds = 10; // Adjust cost factor as needed
    // Initialize state to store form data
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
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
            fetch('http://localhost:3001/api/register', {
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
        <div className="d-flex align-items-center justify-content-center vh-100">
            <form onSubmit={handleSubmit} className="mx-auto p-5 shadow" id="loginForm">
                <h1>Register</h1>
                <div className="d-flex mt-3 justify-content-between">
                    <div className="me-3 form-group">
                        <input type="text" className="inlineInput form-control" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" />
                    </div>
                    <div className='ms-3 form-group'>
                        <input type="text" className="inlineInput form-control" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" />
                    </div>
                </div>
                    <div className="form-group">
                        <input type="text" className="form-control mt-3" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control mt-3" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                    </div>
                <button type="submit" className="btn btn-primary mt-3">Register</button>
            </form >
        </div >
    );
}

export default Register;
