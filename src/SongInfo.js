import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
/**
 * Displays information about a song, including its title, album name,
 * artist name, and length.
 *
 * @param {Object} props The component props
 * @param {Object} props.song - The song object containing song details
 * @param {string} props.song.title - The title of the song
 * @param {string} props.song.length - The length of the song
 * @param {string} props.albumName - The name of the album the song belongs to
 * @param {string} props.artistName - The name of the artist
 * @returns {React.Component} A card displaying song information
 */
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
