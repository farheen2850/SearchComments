import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { 
  ListItem, 
  ListItemText, 
  Paper,
  Typography,
  InputAdornment,
  IconButton
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import TableComponent from './TableComponent';
import '../styles/SearchComponent.css';

function SearchComponent() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [selectedText, setSelectedText] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchData = async (query) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/comments?q=${query}`);
      const result = await response.json();
      setData(result);
      if (!selectedText) {
        setRecommendations(result.slice(0, 5).map((item) => item.name));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch comments');
    }
  };

  const reset = (recommendedText = null) => {
    setRecommendations([]);
    setSelectedText(recommendedText);
    setShowRecommendations(false);
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
    if(searchText.trim() === ''){
      setDisplayData([]);
    } else if(selectedText){
      const filteredResults = data.filter((item) => item.name === selectedText);
      setDisplayData(filteredResults);
    } else {
      setDisplayData(data.slice(0,20));
    }
    reset();
  };

  const handleRecommendedText = (recommendedText) => {
    setSearchText(recommendedText);
    reset();
  };

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    setSelectedText(null);
    setShowRecommendations(true);
  };

  return(
    <>
      <div className='search-container'>
        <Typography variant="h4" className='search-title'>
        Comment Search
        </Typography>
        <form onSubmit={handleSearchSubmit} className='search-form'>
          <TextField 
            id="outlined-basic" 
            label="Search Comments..." 
            variant='outlined'
            value={searchText}
            onChange={handleInputChange} 
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchText && (
                    <IconButton
                      onClick={() => {setSearchText('');}}
                      aria-label='clear-input'
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" className='search-button'>
          Search
          </Button> 
        </form>
        {showRecommendations && recommendations.length > 0 && (
          <Paper elevation={4} className='recommendations-container'>
            {recommendations.map((item, index) => (
              <ListItem key={index} onClick={() => handleRecommendedText(item)}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </Paper>
        )}
        {error ? (
          <Typography variant="subtitle1" color="error" className="no-results">
            {error}
          </Typography>
        ) : displayData.length > 0 ? (
          <TableComponent data={displayData} />
        ) : (
          <Typography variant="subtitle1" className="no-results">
            No results to display. Try searching above.
          </Typography>
        )}

      </div>
    </>
  );
}

export default SearchComponent;