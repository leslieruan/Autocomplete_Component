import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

export default function SearchInput({ searchType, options, inputValue, handleInput, handleSelection }) {
  return (
    <Autocomplete
      key={searchType}
      disablePortal
      options={options}
      sx={{ width: 300 }}
      onInputChange={(event, newValue) => handleInput(event, newValue)}
      onChange={handleSelection}
      inputValue={inputValue}
      getOptionLabel={(option) => option.display || ''}
      filterOptions={(options) => options}
      renderInput={(params) => <TextField {...params} label="Search" />}
    />
  );
}
