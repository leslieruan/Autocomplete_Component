import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

/**
 * Search input component with autocomplete functionality
 * Renders a Material-UI Autocomplete component for searching music data
 * 
 * @param {Object} props The component props
 * @param {string} props.searchType - Type of search (artist, album, song)
 * @param {Array} props.options - Array of search options to display
 * @param {string} props.inputValue - Current value of the input field
 * @param {Function} props.handleInput - Callback function for input changes
 * @param {Function} props.handleSelection - Callback function for selection changes
 * @returns {React.Component} A search input field with autocomplete
 */
export default function SearchInput({ searchType, options, inputValue, handleInput, handleSelection, }) {
  return (
    <Autocomplete
      key={searchType}
      disablePortal
      options={options}
      sx={{ width: 300 }}
      onInputChange={(event, newValue) => handleInput(event, newValue)}
      onChange={handleSelection}
      inputValue={inputValue}
      getOptionLabel={(option) => {
        return option.display || '';
      }}
      renderInput={(params) => <TextField {...params} label="Search" />}
    />
  );
}
