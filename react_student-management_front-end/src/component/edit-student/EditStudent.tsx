// src/components/student/EditStudent.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditStudent.scss';

interface Student {
    name: string;
    phone: string;
    email: string;
}

const EditStudent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get<Student>(`http://localhost:8000/students/${id}`);
                setName(response.data.name);
                setPhone(response.data.phone);
                setEmail(response.data.email);
            } catch (error) {
                setError('Failed to fetch student details.');
                console.error('Error fetching student:', error);
            }
        };

        fetchStudent();
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !phone || !email) {
            setError('Please fill out all fields');
            return;
        }

        try {
            const updatedStudent: Student = { name, phone, email };
            await axios.put(`http://localhost:8000/students/${id}`, updatedStudent);
            setSuccessMessage('Student updated successfully!');
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            setError('Failed to update student. Please try again.');
            console.error('Error updating student:', error);
        }
    };

    return (
        <div className="edit-student">
            <h1>Edit Student</h1>
            <form onSubmit={handleUpdate}>
                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label>Phone</label>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Update Student</button>
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
        </div>
    );
};

export default EditStudent;
