import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function SearchTypeSelect({ searchType, handleSearchTypeChange }) {
  const searchTypes = [
    { value: 'name', label: 'Artist' },
    { value: 'album', label: 'Album' },
    { value: 'song', label: 'Song' },
  ];

  return (
    <FormControl>
      <InputLabel id="search-type-label">Type</InputLabel>
      <Select
        labelId="search-type-label"
        value={searchType}
        label="Search type"
        onChange={handleSearchTypeChange}
      >
        {searchTypes.map((type) => (
          <MenuItem key={type.value} value={type.value}>
            {type.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
