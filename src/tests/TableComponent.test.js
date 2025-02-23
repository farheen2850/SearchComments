import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TableComponent from '../components/TableComponent';

const mockData = [
  {id: 1001, name: 'Test 1', email: 'test1@gmail.com', body: 'Comments for test example 1'},
  {id: 1002, name: 'Test 2', email: 'test2@gmail.com', body: 'Comments for test example 2'},
  {id: 1003, name: 'Test 3', email: 'test3@gmail.com', body: 'Comments for test example three with seventy characters length long!!!!!!'}
];

describe('TableComponent', () => {
  test('renders table headers', () => {
    render(<TableComponent />);
    expect(screen.getByText(/Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Body/i)).toBeInTheDocument();
  });

  test('renders table rows', () => {
    render(<TableComponent data={mockData} />);

    mockData.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(screen.getByText(item.email)).toBeInTheDocument();
      expect(screen.getByText(`${item.body.substring(0, 64)}...`)).toBeInTheDocument();
    });
  });

  test('renders correctly with empty data', () => {
    render(<TableComponent data={[]} />);

    expect(screen.queryByRole('row', { name: /Test 4444/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('row', { name: /Test 0000/i })).not.toBeInTheDocument();
  });
});