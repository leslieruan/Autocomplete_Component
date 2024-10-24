import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export default function SongInfo({ song, albumName, artistName }) {
  return (
    <Card className="song-card">
      <CardContent>
        <Typography variant="h5">{song.title}</Typography>
        <Typography variant="h6">Album: {albumName}</Typography>
        <Typography>Artist: {artistName}</Typography>
        <Typography>Length: {song.length}</Typography>
      </CardContent>
    </Card>
  );
}
