// src/router/AppRoutes.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddStudent from '../component/add-student/AddStudent';
import EditStudent from '../component/edit-student/EditStudent';
import StudentList from '../component/student-list/StudentList';

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<StudentList />} />
                <Route path="/add-student" element={<AddStudent />} />
                <Route path="/edit-student/:id" element={<EditStudent />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
