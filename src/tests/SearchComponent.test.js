import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchComponent from '../components/SearchComponent';
import { act } from '@testing-library/react';

window.fetch = jest.fn();

const mockData = [
  {id: 1001, name: 'Test 1', email: 'test1@gmail.com', body: 'Comments for test example 1'},
  {id: 1002, name: 'Test 2', email: 'test2@gmail.com', body: 'Comments for test example 2'},
  {id: 1003, name: 'Test 3', email: 'test3@gmail.com', body: 'Comments for test example 3'}
];

describe('SearchComponent', () => {
  test('renders the intial search component', () =>{
    render(<SearchComponent />);
    expect(screen.getByText(/Comment Search/i)).toBeInTheDocument();
    expect(screen.getByText(/No results to display. Try searching above./i)).toBeInTheDocument();
  });
});

describe('test for search component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    window.fetch.mockResolvedValue({
      json: async () => mockData,
    });
  });
  
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('renders recommendations', async() =>{
    render(<SearchComponent />);

    const searchInput = screen.getByLabelText(/Search Comments.../i);
    fireEvent.change(searchInput, {target: {value: 'test'}});

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Test 1')).toBeInTheDocument();
      expect(screen.getByText('Test 2')).toBeInTheDocument();
      expect(screen.getByText('Test 3')).toBeInTheDocument();
    });
  });

  test('renders data on table', async() =>{

    render(<SearchComponent />);
    const input = screen.getByLabelText(/Search Comments.../i);
    fireEvent.change(input, { target: { value: 'Test' } });

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
  
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const recommendedItem = screen.getByText('Test 1');
    fireEvent.click(recommendedItem);
  
    const searchButton = screen.getByText('Search');

    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/test1@gmail.com/i)).toBeInTheDocument();
    });

  });

  test('renders data correctly without selecting recommendation', async () => {
    render(<SearchComponent />);
    
    const input = screen.getByLabelText(/Search Comments.../i);
    fireEvent.change(input, { target: { value: 'Test' } });
  
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
  
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
  
    await waitFor(() => {
      expect(screen.getAllByText(/test/i).length).toBeGreaterThan(5);
    });
  });
  

  test('clears input when clear icon is clicked', async () => {
    render(<SearchComponent />);
    const input = screen.getByLabelText(/Search Comments.../i);
    fireEvent.change(input, { target: { value: 'Test' } });

    expect(input.value).toBe('Test');

    const clearIcon = screen.getByTestId('CloseIcon');
    fireEvent.click(clearIcon);

    expect(input.value).toBe('');
  });

  test('shows error when fetch fails', async () => {
    window.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<SearchComponent />);

    const input = screen.getByLabelText(/Search Comments.../i);
    fireEvent.change(input, { target: { value: 'error' } });

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch comments/i)).toBeInTheDocument();
    });
  });
});