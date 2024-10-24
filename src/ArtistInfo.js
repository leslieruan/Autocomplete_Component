import React from 'react';
import { Card, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function ArtistInfo({ artist }) {
  return (
    <div>
      <Card className="artist-card">
        <CardContent>
          <Typography variant="h5">{artist.name}</Typography>
        </CardContent>
      </Card>
      {artist.albums.map((album, index) => (
        <Accordion key={index} className="album-accordion">
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`album-content-${index}`} id={`album-header-${index}`}>
            <Typography variant="h6">{album.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{album.description}</Typography>
            <ul>
              {album.songs.map((song, idx) => (
                <li key={idx}>
                  <Typography variant="body2">{song.title} - {song.length}</Typography>
                </li>
              ))}
            </ul>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
