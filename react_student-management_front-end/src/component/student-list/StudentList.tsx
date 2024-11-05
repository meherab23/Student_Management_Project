// src/components/student/StudentList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './StudentList.scss';

interface Student {
    id: string;
    name: string;
    phone: string;
    email: string;
}

const StudentList: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage] = useState(5);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
    const [deleteMessage, setDeleteMessage] = useState('');

    const fetchStudents = async () => {
        try {
            const response = await axios.get<Student[]>(`http://localhost:8000/students/`);
            setStudents(response.data);
        } catch (error) {
            setError('Failed to fetch students. Please try again later.');
            console.error('Error fetching students:', error);
        }
    };

    const handleDelete = async () => {
        if (studentToDelete) {
            try {
                await axios.delete(`http://localhost:8000/students/${studentToDelete}`);
                setStudents(students.filter(student => student.id !== studentToDelete));
                setDeleteMessage('Student deleted successfully!');
                setTimeout(() => setDeleteMessage(''), 2000);
            } catch (error) {
                setError('Failed to delete student. Please try again.');
                console.error('Error deleting student:', error);
            } finally {
                setShowDeleteModal(false);
                setStudentToDelete(null);
            }
        }
    };

    const confirmDelete = (id: string) => {
        setStudentToDelete(id);
        setShowDeleteModal(true);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.phone.includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div className="student-list">
            <h1>Student List</h1>
            {error && <p className="error-message">{error}</p>}

            <div className="search-add-container">
                <input
                    type="text"
                    placeholder="Search by name, phone, or email"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-bar"
                />
                <Link to="/add-student" className="add-student-button">Add New Student</Link>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentStudents.map((student, index) => (
                        <tr key={student.id}>
                            <td>{indexOfFirstStudent + index + 1}</td>
                            <td>{student.name}</td>
                            <td>{student.phone}</td>
                            <td>{student.email}</td>
                            <td>
                                <Link to={`/edit-student/${student.id}`} className="edit-icon">Edit</Link>
                                <button onClick={() => confirmDelete(student.id)} className="delete-icon">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                {Array.from({ length: Math.ceil(filteredStudents.length / studentsPerPage) }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        className={currentPage === i + 1 ? 'active' : ''}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {showDeleteModal && (
                <div className="modal">
                    <div className="modal-content">
                        <p>Are you sure you want to delete this student?</p>
                        <button className="confirm-delete" onClick={handleDelete}>Yes, Delete</button>
                        <button className="cancel-delete" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {deleteMessage && <div className="delete-message">{deleteMessage}</div>}
        </div>
    );
};

export default StudentList;
