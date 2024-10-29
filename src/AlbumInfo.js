import React from 'react';
import { Card, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
/**
 * Displays information about an album, including its title, artist name,
 * and description. It also includes a collapsible section for the songs in the album.
 *
 * @param {Object} props The component props
 * @param {Object} props.album - The album object containing album details
 * @param {string} props.album.title - The title of the album
 * @param {string} props.album.description - A description of the album
 * @param {Array} props.album.songs - An array of songs in the album
 * @param {string} props.artistName - The name of the artist
 * @returns {React.Component} A card displaying album information and its songs
 */

export default function AlbumInfo({ album, artistName }) {
  return (
    <div>
      <Card className="album-card">
        <CardContent>
          <Typography variant="h5">{album.title}</Typography>
          <Typography variant="h6">Artist: {artistName}</Typography>
          <Typography>{album.description}</Typography>
        </CardContent>
      </Card>
      <Accordion className="songs-accordion">
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="songs-content" id="songs-header">
          <Typography variant="h6">Songs</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul>
            {album.songs.map((song, idx) => (
              <li key={idx}>
                <Typography variant="body2">{song.title} - {song.length}</Typography>
              </li>
            ))}
          </ul>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
