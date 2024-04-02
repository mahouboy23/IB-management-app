import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useTable } from 'react-table';
import './Users.css';

Modal.setAppElement('#root');

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student',
    full_name: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users/get');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`/api/users/${editingUser.user_id}`, formData);
      } else {
        await axios.post('/api/users', formData);
      }
      fetchUsers();
      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '',
      role: user.role,
      full_name: user.full_name
    });
    setModalIsOpen(true);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditingUser(null);
    setFormData({
      username: '',
      password: '',
      role: 'student',
      full_name: ''
    });
  };

  const columns = useMemo(() => [
    {
      Header: 'Full Name',
      accessor: 'full_name'
    },
    {
      Header: 'Username',
      accessor: 'username'
    },
    {
      Header: 'Role',
      accessor: 'role'
    },
    {
      Header: 'Actions',
      id: 'actions',
      Cell: ({ row }) => (
        <div className="action-buttons">
          <button className="edit-button" onClick={() => handleEdit(row.original)}>Edit</button>
          <button className="delete-button" onClick={() => handleDelete(row.original.user_id)}>Delete</button>
        </div>
      )
    }
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
  } = useTable({ columns, data: users });

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Users Management</h2>
      <div>
        <input
          type="text"
          placeholder="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setModalIsOpen(true)}>Add New User</button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="User Form"
        className="modal"
      >
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <span>Full Name:</span>
              <input
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <span>Username:</span>
              <input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <span>Password:</span>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!editingUser}
              />
            </div>
            <div>
              <span>Role:</span>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="coordinator">Coordinator</option>
              </select>
            </div>
            <button type="submit">Submit</button>
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
          {filteredUsers.map(user => {
            return (
              <tr key={user.user_id}>
                <td>{user.full_name}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-button" onClick={() => handleEdit(user)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(user.user_id)}>Delete</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
