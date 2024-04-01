import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Classes = ({ teacherId }) => {
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get(`/api/classes/${teacherId}`);
                setClasses(response.data.classes);
                console.log("data fetched")
            } catch (error) {
                console.error('Failed to fetch classes', error);
            }
        };

        fetchClasses();
    }, [teacherId]);

    return (
        <div className="classes-container">
            <h2>My Classes</h2>
            <div className="classes-list">
                {classes.map((classItem) => (
                    <div key={classItem.class_id} className="class-item">
                        <h3>{classItem.class_name}</h3>
                        <p>Subject: {classItem.subject}</p>
                        <p>Grade: {classItem.grade_level}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Classes;