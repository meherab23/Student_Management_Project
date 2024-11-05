// src/components/student/AddStudent.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddStudent.scss'; // Ensure the correct path to the SCSS file

interface Student {
    name: string;
    phone: string;
    email: string;
}

const AddStudent: React.FC = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation: Check if all fields are filled out
        if (!name || !phone || !email) {
            setError('Please fill out all fields');
            return;
        }

        try {
            const newStudent: Student = { name, phone, email };
            await axios.post(`http://localhost:8000/students/`, newStudent);

            // Show success message and reset form fields
            setSuccessMessage('Student added successfully!');
            setName('');
            setPhone('');
            setEmail('');
            setError('');

            // Navigate to Student List page after a short delay
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            setError('Failed to add student. Please try again.');
            console.error('Error adding student:', error);
        }
    };

    return (
        <div className="add-student">
            <h1>Add New Student</h1>
            <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter student's name"
                />
                
                <label>Phone</label>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter student's phone number"
                />
                
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter student's email"
                />
                
                <button type="submit">Add Student</button>

                {/* Display error or success messages */}
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
        </div>
    );
};

export default AddStudent;
