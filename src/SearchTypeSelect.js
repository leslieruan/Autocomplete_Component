import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
/**
 * Search type selection component
 * Allows users to switch between different search modes (Artist, Album, Song)
 * 
 * @param {Object} props The component props
 * @param {string} props.searchType - Current selected search type
 * @param {Function} props.handleSearchTypeChange - Callback function for search type changes
 * @returns {React.Component} A dropdown select for search types
 */
export default function SearchTypeSelect({ searchType, handleSearchTypeChange }) {
  const searchTypes = [
    { value: 'name', label: 'Artist' },
    { value: 'album', label: 'Album' },
    { value: 'song', label: 'Song' },
  ];
  return (
    <FormControl>
      <InputLabel id="search-type-label">Type</InputLabel>
      {/* Search type dropdown menu */}
      <Select
        labelId="search-type-label"
        value={searchType}
        label="Search type"
        onChange={handleSearchTypeChange}
      >
        {/* Render menu items for each search type */}
        {searchTypes.map((type) => (
          <MenuItem key={type.value} value={type.value}>
            {type.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
