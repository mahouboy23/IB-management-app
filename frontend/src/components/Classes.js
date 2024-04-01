import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import './Classes.css';

const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [students, setStudents] = useState([]);
    const { user } = useContext(AuthContext);
    const teacherId = user?.userId;

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                if (teacherId) {
                    const response = await axios.get(`/api/classes/${teacherId}`);
                    setClasses(response.data.classes);
                    console.log("data fetched");
                }
            } catch (error) {
                console.error('Failed to fetch classes', error);
            }
        };

        fetchClasses();
    }, [teacherId]);

    const handleClassClick = async (classItem) => {
        setSelectedClass(classItem);
        try {
            const response = await axios.get(`/api/students/class/${classItem.class_id}`);
            setStudents(response.data.students);
        } catch (error) {
            console.error('Failed to fetch students', error);
        }
    };

    return (
        <div className="classes-container">
            <h2 className="classes-title">My Classes</h2>
            <div className="classes-list">
                {classes.map((classItem) => (
                    <div
                        key={classItem.class_id}
                        className={`class-item ${selectedClass?.class_id === classItem.class_id ? 'selected' : ''}`}
                        onClick={() => handleClassClick(classItem)}
                    >
                        <h3 className="class-name">{classItem.class_name}</h3>
                        <p className="class-details">
                            <span className="class-subject">Subject: {classItem.subject}</span>
                            <span className="class-grade">Grade: {classItem.grade_level}</span>
                        </p>
                    </div>
                ))}
            </div>
            {selectedClass && (
                <div className="class-students-container">
                    <h3 className="class-students-title">Students in {selectedClass.class_name}</h3>
                    <ul className="class-students-list">
                        {students.map((student) => (
                            <li key={student.user_id} className="class-student-item">{student.full_name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Classes;