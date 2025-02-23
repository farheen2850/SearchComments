import React from 'react';
import { 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Paper, 
} from '@mui/material';
import '../styles/TableComponent.css';

function TableComponent({ data }) {
  return (
    <TableContainer component={Paper} className='table-container'>
      <Table stickyHeader>
        <TableHead>
          <TableRow className='table-header'>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell><strong>Email</strong></TableCell>
            <TableCell><strong>Body</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((item) => (
            <TableRow key={item.id} className='table-row'>
              <TableCell className='table-cell'>{item.name}</TableCell>
              <TableCell className='table-cell'>{item.email}</TableCell>
              <TableCell className='table-cell'>{item.body.substring(0, 64)}...</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


export default TableComponent;
