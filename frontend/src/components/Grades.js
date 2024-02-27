import React, { useMemo } from 'react';
import { useTable } from 'react-table';
import './Grades.css'; // Make sure you have the corresponding CSS file

function Grades() {
  const data = useMemo(
    () => [
      { id: 1, name: "Breal Ciceron", moyenneClass: "4/7", grade: "6/7", date: "20 Jan, 2022", level: "HL" },
      { id: 2, name: "Breal Ciceron", moyenneClass: "4/7", grade: "5/7", date: "22 Feb, 2022", level: "HL" },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name', // accessor is the "key" in the data
      },
      {
        Header: 'Moyenne Class',
        accessor: 'moyenneClass',
      },
      {
        Header: 'Grade',
        accessor: 'grade',
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
  // Here you would handle the deletion logic, such as making an API call to delete the grade
}

export default Grades;
