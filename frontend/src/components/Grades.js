import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTable } from 'react-table';
import axios from 'axios';
import Modal from 'react-modal';
import './Grades.css';

Modal.setAppElement('#root');

function Grades() {
  const [message, setMessage] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [gradesData, setGradesData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newGrade, setNewGrade] = useState({
    studentId: '',
    classId: '',
    gradeValue: '',
    totalValue: '',
    trimester: ''
  });

  const fetchGrades = useCallback(async (studentId = '', classId = '', trimester = '') => {
    try {
      const response = await axios.get(`/api/grades/filter/${studentId}/${classId}/${trimester}`);
      setGradesData(response.data.grades);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('/api/students');
        setStudents(response.data.students);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await axios.get('/api/classes/4');
        setClasses(response.data.classes);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    const fetchInitialData = async () => {
      try {
        const classesResponse = await axios.get('/api/classes');
        setClasses(classesResponse.data.classes);
        const studentsResponse = await axios.get('/api/students');
        setStudents(studentsResponse.data.students);
        fetchGrades(); // Fetch all grades initially
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchStudents();
    fetchClasses();
    fetchInitialData();
  }, [fetchGrades]);

   // Modify handleStudentChange to filter grades based on both student and class
   const handleStudentChange = (e) => {
    const studentId = e.target.value;
    setNewGrade({ ...newGrade, studentId });
    fetchGrades(studentId, newGrade.classId, newGrade.trimester);
  };

  // Modify handleClassChange to filter grades and update student dropdown
  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setNewGrade({ ...newGrade, classId });
    if (classId) {
      const studentsResponse = await axios.get(`/api/students/class/${classId}`);
      setStudents(studentsResponse.data.students);
    } else {
      const allStudentsResponse = await axios.get('/api/students');
      setStudents(allStudentsResponse.data.students);
    }
    fetchGrades(newGrade.studentId, classId, newGrade.trimester);
  };  

  // Modify handleTrimesterChange to filter grades based on trimester
  const handleTrimesterChange = (e) => {
    const trimester = e.target.value;
    setNewGrade({ ...newGrade, trimester });
    fetchGrades(newGrade.studentId, newGrade.classId, trimester);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting new grade:", newGrade);
      const response = await axios.post('/api/grades', {
        ...newGrade,
        totalValue: newGrade.totalValue // Include totalValue in the POST request
      });
      if (response.data.warningMessage) {
        setWarningMessage(response.data.warningMessage);
        setIsWarningModalOpen(true);
      } else {
        console.log(response.data.message);
        setModalIsOpen(false);
        fetchGrades(newGrade.studentId); // Refresh grades for the selected student after adding a new grade
      } }
    catch (error) {
      // Set the error message to be displayed in the UI
      setMessage(error.response.data.message || 'Failed to add grade.');
      setIsErrorModalOpen(true);
    }
  };

  const handleDelete = useCallback(async (gradeId) => {
    try {
      await axios.delete(`/api/grades/${gradeId}`);
      fetchGrades(newGrade.studentId); // Refresh grades for the selected student after deleting a grade
    } catch (error) {
      console.error('Failed to delete grade:', error);
    }
  }, [newGrade.studentId, fetchGrades]);

  const data = useMemo(() => gradesData, [gradesData]);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'student_name',
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
          <button className="delete-button" onClick={() => handleDelete(row.original.grade_id)}>Delete</button>
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
      <div className="student-group">
        <label>
          <select
            value={newGrade.studentId}
            onChange={handleStudentChange}
            className="student-input"
          >
            <option value="0">None</option>
            {students.map(student => (
              <option key={student.user_id} value={student.user_id}>{student.full_name}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="class-group">
        <label>
          <select
            value={newGrade.classId}
            onChange={handleClassChange}
            className="class-input"
          >
            {classes.map(classItem => (
              <option key={classItem.class_id} value={classItem.class_id}>{classItem.class_name}</option>
            ))}
          </select>
        </label>
        <div className="trimester-dropdown">
       <label>
        <select
          value={newGrade.trimester}
          onChange={handleTrimesterChange}
          className="b-input"
        >
         {[1, 2, 3].map(trimester => (
         <option key={trimester} value={trimester}>{trimester}</option>
          ))}
        </select>
       </label>
</div>
      </div>
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
              <div className="form-group">
            <label>
              Total Value:
              <input
                type="text"
                value={newGrade.totalValue}
                onChange={(e) => setNewGrade({ ...newGrade, totalValue: e.target.value })}
                className="modal-input"
              />
            </label>
          </div>
            </div>
            <button className='modal-submit-button' type="submit">Submit</button>
          </form>
        </div>
      </Modal>
      
<Modal
  isOpen={isErrorModalOpen}
  onRequestClose={() => setIsErrorModalOpen(false)}
  contentLabel="Error Message"
  className="modal"
>
  <div className="modal-error-header">
    <h2>Error</h2>
  </div>
  <div className="modal-error-body">
    <div className="warning-message">{message}</div>
    <button className='modal-error-submit-button' onClick={() => setIsErrorModalOpen(false)}>Close</button>
  </div>
</Modal>

<Modal
  isOpen={isWarningModalOpen}
  onRequestClose={() => setIsWarningModalOpen(false)}
  contentLabel="Warning Message"
  className="modal-warning"
>
  <div className="modal-warning-header">
    <h2>Warning</h2>
  </div>
  <div className="modal-warning-body">
    <div className="warning-message">{warningMessage}</div>
    <button className='modal-warning-submit-button' onClick={() => setIsWarningModalOpen(false)}>Close</button>
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