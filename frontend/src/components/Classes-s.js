import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import './Classes-s.css';

const StudentClasses = () => {
    const [classes, setClasses] = useState([]);
    const { user } = useContext(AuthContext);
    const studentId = user?.userId;

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                if (studentId) {
                    const response = await axios.get(`/api/students/${studentId}/classes`);
                    setClasses(response.data.classes);
                    console.log("Classes data fetched");
                }
            } catch (error) {
                console.error('Failed to fetch classes', error);
            }
        };

        fetchClasses();
    }, [studentId]);

    return (
        <div className="student-classes-container">
            <h2 className="student-classes-title">My Classes</h2>
            <div className="student-classes-list">
                {classes.map((classItem) => (
                    <div key={classItem.class_id} className="student-class-item">
                        <h3 className="student-class-name">{classItem.class_name}</h3>
                        <p className="student-class-details">
                            <span className="student-class-subject">Subject: {classItem.subject}</span>
                            <span className="student-class-grade">Grade: {classItem.grade_level}</span>
                            <span className="student-class-teacher">Teacher: {classItem.teacher_name}</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentClasses;