import React from 'react';
import { Card, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
