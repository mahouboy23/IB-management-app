import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import './Grades-s.css';

const Grades = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [grades, setGrades] = useState([]);
    const [selectedTrimester, setSelectedTrimester] = useState('');
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

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                if (studentId && selectedClass) {
                    const response = await axios.get(`/api/grades/filter/${studentId}/${selectedClass.class_id}/${selectedTrimester}`);
                    setGrades(response.data.grades);
                    console.log("Grades data fetched");
                }
            } catch (error) {
                console.error('Failed to fetch grades', error);
            }
        };

        fetchGrades();
    }, [studentId, selectedClass, selectedTrimester]);

    const handleClassClick = (classItem) => {
        setSelectedClass(classItem);
    };

    return (
        <div className="grades-container">
            <h2 className="grades-title">My Grades</h2>
            <div className="class-list">
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
                <div className="grades-list">
                    <h3 className="grades-title">Grades for {selectedClass.class_name}</h3>
                    <div className="trimester-filter">
                        <label htmlFor="trimester-select">Filter by Trimester:</label>
                        <select
                            id="trimester-select"
                            value={selectedTrimester}
                            onChange={(e) => setSelectedTrimester(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="1">Trimester 1</option>
                            <option value="2">Trimester 2</option>
                            <option value="3">Trimester 3</option>
                        </select>
                    </div>
                    <ul className="grades-list">
                        {grades.map((grade) => (
                            <li key={grade.grade_id} className="grade-item">
                                <span className="grade-value">Grade: {grade.grade_value}</span>
                                <span className="grade-date">Date: {grade.date}</span>
                                <span className="grade-trimester">Trimester: {grade.trimester}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Grades;
