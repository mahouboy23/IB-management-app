import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useTable } from 'react-table';

Modal.setAppElement('#root');

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(''); // Define the search state variable
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
      const response = await axios.get('/api/users/get'); // Make sure this matches your API route
      console.log('Fetched users:', response.data.users); // Log the fetched data
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    fetchUsers(); // Use the search state variable to fetch users
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
      password: '', // For security reasons, don't fetch or autofill passwords
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
      id: 'actions', // Added an ID to avoid warning about missing accessor
      Cell: ({ row }) => (
        <>
          <button onClick={() => handleEdit(row.original)}>Edit</button>
          <button onClick={() => handleDelete(row.original.user_id)}>Delete</button>
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
  } = useTable({ columns, data: users });

  return (
    <div>
      <h2>Users Management</h2>
      <input
        type="text"
        placeholder="Search users"
        value={search}
        onChange={handleSearchChange}
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={() => setModalIsOpen(true)}>Add New User</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="User Form"
      >
        <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Full Name:
            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Username:
            <input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Password:
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required={!editingUser}
            />
          </label>
          <label>
            Role:
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
          </label>
          <button type="submit">Submit</button>
          <button onClick={closeModal}>Cancel</button>
        </form>
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
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
