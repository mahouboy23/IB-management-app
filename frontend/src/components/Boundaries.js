import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Boundaries.css';

function Boundaries() {
  const [boundaries, setBoundaries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBoundary, setSelectedBoundary] = useState(null);
  const [newBoundary, setNewBoundary] = useState({
    classId: '',
    overValue: '',
    grades: [
      { min: '', max: '', ib_grade: 1 },
      { min: '', max: '', ib_grade: 2 },
      { min: '', max: '', ib_grade: 3 },
      { min: '', max: '', ib_grade: 4 },
      { min: '', max: '', ib_grade: 5 },
      { min: '', max: '', ib_grade: 6 },
      { min: '', max: '', ib_grade: 7 },
    ]
  });

  useEffect(() => {
    fetchBoundaries();
  }, []);

  const fetchBoundaries = async () => {
    try {
      const response = await axios.get('/api/grade-boundaries');
      setBoundaries(response.data.boundaries);
    } catch (error) {
      console.error('Error fetching grade boundaries:', error);
    }
  };

  const handleBoundaryChange = (e) => {
    const { name, value } = e.target;
    setNewBoundary({ ...newBoundary, [name]: value });
  };

  const handleGradeRangeChange = (gradeIndex, field, value) => {
    setNewBoundary((prevState) => {
      const updatedGrades = [...prevState.grades];
      updatedGrades[gradeIndex] = {
        ...updatedGrades[gradeIndex],
        [field]: value,
      };
      return { ...prevState, grades: updatedGrades };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/grade-boundaries', newBoundary);
      fetchBoundaries();
      setShowModal(false);
      setNewBoundary({
        classId: '',
        overValue: '',
        grades: Array(7).fill({ min: '', max: '' }),
      });
    } catch (error) {
      console.error('Failed to submit grade boundary:', error);
    }
  };

  const handleEdit = (boundary) => {
    setSelectedBoundary(boundary);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/grade-boundaries/${selectedBoundary.boundary_id}`, {
        overValue: selectedBoundary.over_value,
        grades: selectedBoundary.grades,
      });
      fetchBoundaries();
      setSelectedBoundary(null);
    } catch (error) {
      console.error('Error updating grade boundary:', error);
    }
  };

  const handleDelete = async (boundaryId) => {
    try {
      await axios.delete(`/api/grade-boundaries/${boundaryId}`);
      fetchBoundaries();
    } catch (error) {
      console.error('Error deleting grade boundary:', error);
    }
  };

  return (
    <div className="container">
      <h2>Grade Boundaries Management</h2>
      <button onClick={() => setShowModal(true)}>Add New Boundary</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2>Add Grade Boundary</h2>
            <input
              type="text"
              name="classId"
              value={newBoundary.classId}
              onChange={handleBoundaryChange}
              placeholder="Class ID"
            />
            <input
              type="number"
              name="overValue"
              value={newBoundary.overValue}
              onChange={handleBoundaryChange}
              placeholder="Over Value"
            />
            {newBoundary.grades.map((grade, index) => (
              <div key={index}>
                <span>Grade {index + 1}</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={grade.min}
                  onChange={(e) =>
                    handleGradeRangeChange(index, 'min', e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={grade.max}
                  onChange={(e) =>
                    handleGradeRangeChange(index, 'max', e.target.value)
                  }
                />
              </div>
            ))}
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Class</th>
            <th>Over Value</th>
            <th>Grades</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {boundaries.map((boundary) => (
            <tr key={boundary.boundary_id}>
              <td>{boundary.class_id}</td>
              <td>{boundary.over_value}</td>
              <td>
                {boundary.grades.map((grade, index) => (
                  <div key={index}>
                    Grade {index + 1}: {grade.min}-{grade.max}
                  </div>
                ))}
              </td>
              <td>
                <button onClick={() => handleEdit(boundary)}>Edit</button>
                <button onClick={() => handleDelete(boundary.boundary_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedBoundary && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Grade Boundary</h2>
            {selectedBoundary.grades.map((grade, index) => (
              <div key={index}>
                <span>Grade {index + 1}</span>
                <input
                  type="number"
                  value={grade.min}
                  onChange={(e) =>
                    setSelectedBoundary((prevBoundary) => {
                      const updatedGrades = [...prevBoundary.grades];
                      updatedGrades[index] = {
                        ...updatedGrades[index],
                        min: e.target.value,
                      };
                      return { ...prevBoundary, grades: updatedGrades };
                    })
                  }
                />
                <input
                  type="number"
                  value={grade.max}
                  onChange={(e) =>
                    setSelectedBoundary((prevBoundary) => {
                      const updatedGrades = [...prevBoundary.grades];
                      updatedGrades[index] = {
                        ...updatedGrades[index],
                        max: e.target.value,
                      };
                      return { ...prevBoundary, grades: updatedGrades };
                    })
                  }
                />
              </div>
            ))}
            <button onClick={handleUpdate}>Update</button>
            <button onClick={() => setSelectedBoundary(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Boundaries;
