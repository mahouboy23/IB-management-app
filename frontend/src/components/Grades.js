import React, { useMemo, useState, useEffect } from 'react';
import { useTable } from 'react-table';
import axios from 'axios';
import './Grades.css'; // Make sure you have the corresponding CSS file

function Grades() {
  const [gradesData, setGradesData] = useState([]);

  useEffect(() => {
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

    fetchGrades();
  }, []);

  const data = useMemo(() => gradesData, [gradesData]);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'student_name', // accessor is the "key" in the data
      },
      {
        Header: 'Moyenne Class',
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
          <button onClick={() => handleDelete(row.original.id)}>Delete</button> // Add your deletion logic here
        ),
      },
    ],
    []
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

// Replace with the actual delete logic
function handleDelete(gradeId) {
  console.log('Deleting grade with id:', gradeId);
  
const postIdToDelete = 4;
axios.delete(`/api/grades/${postIdToDelete}`)
  .catch(error => {
    console.error(error);
  });
  window.location.reload(false)
}

export default Grades;
