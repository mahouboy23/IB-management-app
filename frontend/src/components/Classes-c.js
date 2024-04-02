// ClassManagement.js
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useTable } from 'react-table';
import './Classes-c.css';

Modal.setAppElement('#root');

function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    class_name: '',
    grade_level: '11',
    subject: '',
    teacher_id: '',
    teacher_name: ''
  });
  const [assignModalIsOpen, setAssignModalIsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchStudent, setSearchStudent] = useState('');
  const [expandedClass, setExpandedClass] = useState(null);
  const [availableStudents, setAvailableStudents] = useState([]);

  useEffect(() => {
    fetchClasses();
    fetchStudents();
    fetchTeachers();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/classes');
      setClasses(response.data.classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/users/student');
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchStudentsByClass = async (classId) => {
    try {
      const response = await axios.get(`/api/students/class/${classId}`);
      console.log(response.data.students);
      return response.data.students;
    } catch (error) {
      console.error('Error fetching students by class:', error);
      return [];
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/api/users/teacher');
      setTeachers(response.data.teachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleExpandedClass = async (classId) => {
    if (expandedClass && expandedClass.classId === classId) {
      setExpandedClass(null);
    } else {
      const students = await fetchStudentsByClass(classId);
      setExpandedClass({ classId, students });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await axios.put(`/api/classes/${editingClass.class_id}`, {
          className: formData.class_name,
          gradeLevel: formData.grade_level,
          subject: formData.subject,
          teacherId: formData.teacher_id
        });
      } else {
        await axios.post('/api/classes', {
          className: formData.class_name,
          gradeLevel: formData.grade_level,
          subject: formData.subject,
          teacherId: formData.teacher_id
        });
      }
      fetchClasses();
      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setFormData({
      class_name: classItem.class_name,
      grade_level: classItem.grade_level,
      subject: classItem.subject,
      teacher_id: classItem.teacher_id
    });
    setModalIsOpen(true);
  };

  const handleDelete = async (classId) => {
    try {
      await axios.delete(`/api/classes/${classId}`);
      fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const handleAssignStudent = async (classItem) => {
    setSelectedClass(classItem);
    try {
      const response = await axios.get(`/api/classes/${classItem.class_id}/students/not-in-class`);
      console.log("Students not in class:", response.data.students);
      setAvailableStudents(response.data.students);
      setAssignModalIsOpen(true);
    } catch (error) {
      console.error('Error fetching students not in class:', error);
    }
  };

  const AssignStudent = async (studentId) => {
    try {
      await axios.post(`/api/classes/${selectedClass.class_id}/students/${studentId}`);
      fetchClasses();
      setAssignModalIsOpen(false);
    } catch (error) {
      console.error('Error assigning student:', error);
    }
  };

  const removeStudent = async (classId, studentId) => {
    try {
      await axios.delete(`/api/classes/${classId}/students/${studentId}`);
      const updatedStudents = await fetchStudentsByClass(classId);
      setExpandedClass((prevExpandedClass) => {
        if (prevExpandedClass && prevExpandedClass.classId === classId) {
          return { ...prevExpandedClass, students: updatedStudents };
        }
        return prevExpandedClass;
      });
    } catch (error) {
      console.error('Error removing student:', error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditingClass(null);
    setFormData({
      class_name: '',
      grade_level: '11',
      subject: '',
      teacher_id: '10'
    });
  };

  const columns = useMemo(() => [
    {
      Header: 'Class Name',
      accessor: 'class_name'
    },
    {
      Header: 'Grade Level',
      accessor: 'grade_level'
    },
    {
      Header: 'Subject',
      accessor: 'subject'
    },
    {
      Header: 'Teacher',
      accessor: 'teacher_name'
    },
    {
      Header: 'Actions',
      id: 'actions',
      Cell: ({ row }) => (
        <>
          <button className="edit-button" onClick={() => handleEdit(row.original)}>Edit</button>
          <button className="delete-button" onClick={() => handleDelete(row.original.class_id)}>Delete</button>
          <button className="assign-button" onClick={() => handleAssignStudent(row.original)}>Assign Student</button>
        </>
      )
    }
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: classes });

  const filteredStudents = students.filter(student =>
    student.full_name.toLowerCase().includes(searchStudent.toLowerCase())
  );

  return (
    <div className="class-management-container">
      <h2>Class Management</h2>
      <button className="add-class-button" onClick={() => setModalIsOpen(true)}>Add New Class</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Class Form"
        className="modal"
      >
        <div className="modal-content">
          <h2>{editingClass ? 'Edit Class' : 'Add New Class'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Class Name:
                <input
                  name="class_name"
                  value={formData.class_name}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Grade Level:
                <select
                  name="grade_level"
                  value={formData.grade_level}
                  onChange={handleInputChange}
                  required
                >
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              </label>
            </div>
            <div className="form-group">
              <label>
                Subject:
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Teacher:
                <select
                  name="teacher_id"
                  value={formData.teacher_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.user_id} value={teacher.user_id}>
                      {teacher.full_name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-actions">
              <button type="submit">Submit</button>
              <button type="button" onClick={closeModal}>Cancel</button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={assignModalIsOpen}
        onRequestClose={() => setAssignModalIsOpen(false)}
        contentLabel="Assign Student"
        className="assign-modal"
      >
        <div className="assign-modal-content">
          <h2>Assign Student to Class</h2>
          <input
            type="text"
            placeholder="Search students"
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
          />
          <ul>
            {availableStudents
              .filter(student => student.full_name.toLowerCase().includes(searchStudent.toLowerCase()))
              .map(student => (
                <li key={student.user_id}>
                  {student.full_name}
                  <button onClick={() => AssignStudent(student.user_id)}>Assign</button>
                </li>
              ))}
          </ul>
          <button onClick={() => setAssignModalIsOpen(false)}>Close</button>
        </div>
      </Modal>
      <table {...getTableProps()} className="class-table">
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
            const isExpanded = expandedClass && expandedClass.classId === row.original.class_id;
            return (
              <>
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                  <td>
                    <button
                      className={`expand-button ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => toggleExpandedClass(row.original.class_id)}
                    >
                      {isExpanded ? 'Collapse' : 'Expand'}
                    </button>
                  </td>
                </tr>
                {isExpanded && expandedClass.students && (
                  <tr>
                    <td colSpan={columns.length + 1}>
                      <h4>Students:</h4>
                      <ul className="student-list">
                        {expandedClass.students.map(student => (
                          <li key={student.user_id}>
                            {student.full_name}
                            <button
                              className="remove-student-button"
                              onClick={() => removeStudent(row.original.class_id, student.user_id)}
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ClassManagement;
