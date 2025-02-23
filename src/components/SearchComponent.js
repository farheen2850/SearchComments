import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Button, Typography } from '@mui/material';
import TableComponent from './TableComponent';
import '../styles/SearchComponent.css';

function SearchComponent() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async (query) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/comments?q=${query}`);
      const result = await response.json();
      setData(result);
      setRecommendations(result.slice(0, 5).map((item) => item.name));
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch comments');
    }
  };

  useEffect(() => {
    if (searchText.length > 3) {
      const timer = setTimeout(() => {
        fetchData(searchText);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setRecommendations([]);
    }
  }, [searchText]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchText.trim() === '') {
      setDisplayData([]);
    } else {
      const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setDisplayData(filteredData.slice(0, 20));
    }
  };

  return (
    <div className='search-container'>
      <Typography variant='h4' className='search-title'>
        Comment Search
      </Typography>

      <form onSubmit={handleSearchSubmit} className='search-form'>
        <Autocomplete
          freeSolo
          autoSelect
          options={recommendations}
          inputValue={searchText}
          onInputChange={(event, newInputValue) => setSearchText(newInputValue)}
          onChange={(event, newValue) => {
            if (newValue) {
              setSearchText(newValue);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Search Comments...'
              variant='outlined'
              className='search-textfield'
            />
          )}
        />

        <Button type='submit' variant='contained' className='search-button'>
          Search
        </Button>
      </form>

      {error ? (
        <Typography variant='subtitle1' className='error'>
          {error}
        </Typography>
      ) : displayData.length > 0 ? (
        <TableComponent data={displayData} />
      ) : (
        <Typography variant='subtitle1' className='no-results'>
          No results to display. Try searching above.
        </Typography>
      )}
    </div>
  );
}

export default SearchComponent;
