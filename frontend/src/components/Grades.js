import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTable } from 'react-table';
import axios from 'axios';
import Modal from 'react-modal';
import './Grades.css'; // Make sure you have the corresponding CSS file

Modal.setAppElement('#root');

function Grades() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [gradesData, setGradesData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newGrade, setNewGrade] = useState({
    studentId: '',
    classId: '',
    gradeValue: '',
    trimester: ''
  });
  
  // Function to fetch grades
  const fetchGrades = async () => {
    try {
      const response = await axios.get('/api/grades/3'); // Replace with the actual student ID or parameterize as needed
      setGradesData(response.data.grades); // Assuming the response has a .grades property with the grades array
    } catch (error) {
      console.error('Error fetching grades:', error);
      // Handle error here, such as setting an error state to display an error message
    }
  };

  useEffect(() => {
    
    fetchGrades();

    // Fetch students
    const fetchStudents = async () => {
      try {
        const response = await axios.get('/api/students');
        setStudents(response.data.students);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    // Fetch classes
    const fetchClasses = async () => {
      try {
        const response = await axios.get('/api/classes/4');
        setClasses(response.data.classes);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchGrades();
    fetchStudents();
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace the URL with your actual endpoint URL
      console.log("Submitting new grade:", newGrade);
      const response = await axios.post('/api/grades', newGrade);
      console.log(response.data.message);
      setModalIsOpen(false);
      await fetchGrades();
    } catch (error) {
      console.error('Failed to add grade:', error);
    }
  };

  const handleDelete = useCallback(async (gradeId) => {
    try {
      await axios.delete(`/api/grades/${gradeId}`);
      // Refresh grades after deletion without reloading the page
      await fetchGrades();
    } catch (error) {
      console.error('Failed to delete grade:', error);
    }
  }, []);

  const data = useMemo(() => gradesData, [gradesData]);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'student_name', // accessor is the "key" in the data
      },
      {
        Header: 'Class',
        accessor: 'class_name',
      },
      {
        Header: 'Grade',
        accessor: 'grade_value',
      },
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Level',
        accessor: 'level',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <button className="delete-button" onClick={() => handleDelete(row.original.grade_id)}>Delete</button> // Add your deletion logic here
        ),
      },
    ],
    [handleDelete]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div>
      <h2>Grade Management</h2>
      <button className="add-grade-btn" onClick={() => setModalIsOpen(true)}>Add New Grade</button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Add New Grade"
        ariaHideApp={false}
        className="modal"
      >
        <div className="modal-header">
          <h2>Add New Grade</h2>
          <button className='modal-close-button' onClick={() => setModalIsOpen(false)}>✖</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Student:
                <select
                  value={newGrade.studentId}
                  onChange={(e) => setNewGrade({ ...newGrade, studentId: e.target.value })}
                  className="modal-input"
                >
                  {students.map(student => (
                    <option key={student.user_id} value={student.user_id}>{student.full_name}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-group">
              <label>
                Class:
                <select
                  value={newGrade.classId}
                  onChange={(e) => setNewGrade({ ...newGrade, classId: e.target.value })}
                  className="modal-input"
                >
                  {classes.map(classItem => (
                    <option key={classItem.class_id} value={classItem.class_id}>{classItem.class_name}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-group">
              <label>
                Trimester:
                <div className="trimester-buttons">
                  {['1', '2', '3'].map(trimester => (
                    <button
                      key={trimester}
                      type="button"
                      className={`trimester-button ${newGrade.trimester === trimester ? 'active' : ''}`}
                      onClick={() => setNewGrade({ ...newGrade, trimester })}
                    >
                      {trimester}
                    </button>
                  ))}
                </div>
              </label>
            </div>
            <div className="form-group">
              <label>
                Grade Value:
                <input
                  type="text"
                  value={newGrade.gradeValue}
                  onChange={(e) => setNewGrade({ ...newGrade, gradeValue: e.target.value })}
                  className="modal-input"
                />
              </label>
            </div>
            <button className='modal-submit-button' type="submit" >Submit</button>
          </form>
        </div>
      </Modal>


      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Grades;