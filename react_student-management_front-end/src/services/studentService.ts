// src/services/studentservice.ts
import axios from 'axios';

const API_URL = 'http://localhost:8000';

interface Student {
    _id?: string; 
    name: string;
    phone: string;
    email: string;
}

const getstudents = async (): Promise<Student[]> => {
    try {
        const response = await axios.get(`${API_URL}/students`);
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw new Error('Failed to fetch students');
    }
};

const getStudentById = async (studentId: string): Promise<Student> => {
    try {
        const response = await axios.get(`${API_URL}/students/${studentId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching student with ID: ${studentId}`, error);
        throw new Error('Failed to fetch student');
    }
};

const addStudent = async (student: Student): Promise<Student> => {
    try {
        const response = await axios.post(`${API_URL}/students`, student);
        return response.data;
    } catch (error) {
        console.error('Error adding student:', error);
        throw new Error('Failed to add student');
    }
};

const updateStudent = async (studentId: string, student: Student): Promise<Student> => {
    try {
        const response = await axios.put(`${API_URL}/students/${studentId}`, student);
        return response.data;
    } catch (error) {
        console.error(`Error updating student with ID: ${studentId}`, error);
        throw new Error('Failed to update student');
    }
};

const deleteStudent = async (studentId: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/students/${studentId}`);
    } catch (error) {
        console.error(`Error deleting student with ID: ${studentId}`, error);
        throw new Error('Failed to delete student');
    }
};

export default {
    getstudents,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent,
};
