import * as React from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Card, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { Grid } from '@mui/system';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



export default function SearchDropdown() {
    const [musicData, setMusicData] = React.useState([]);
    const [options, setOptions] = React.useState([]);
    const [selection, setSelection] = React.useState(null);
    const [searchType, setSearchType] = React.useState('name');
    const [inputValue, setInputValue] = React.useState('');

    const searchTypes = [
        { value: 'name', label: 'Artist' },
        { value: 'album', label: 'Album' },
        { value: 'song', label: 'Song' }
    ]

    React.useEffect(() => {
        // fetch the local json data
        fetch('./data.json')
            .then((response) => {
                if (!response.ok) {
                    throw new console.error('response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setMusicData(data);

            })
            .catch((error) => {
                console.error("Error fetching the data:", error);
            })
    }, []);


    const handleSearchTypeChange = async (event) => {
        setSearchType(event.target.value);
        setOptions([]);
        setSelection(null);
        setInputValue('');
    }


    // function to handle the input changes
    const handleInput = (e, value) => {
        setInputValue(value);
        if (!value) {
            setOptions([]);
            return;
        }

        const searchTxt = value.toLowerCase();
        // only filter the empty strings 
        const searchWords = searchTxt.split(' ').filter(word => word !== ' ');
        let searchResults = [];

        musicData.forEach(artist => {
            if (searchType === 'name') {
                const artistWords = artist.name.toLowerCase().split(' ');
                const basicMacth = artist.name.toLowerCase().includes(searchWords);
                const wordMatch = searchWords.length > 0 && searchWords.every(w => artist.name.toLowerCase().includes(w));
                const unorderedMatch = searchWords.length > 0 && searchWords.every(searchw =>
                    artistWords.some(artistw => artistw.includes(searchw)))
                // search artist 
                if (basicMacth || wordMatch || unorderedMatch) {
                    searchResults.push({
                        type: 'artist',
                        name: artist.name,
                        display: `${artist.name}`,
                        basicMacth,
                        wordMatch,
                        unorderedMatch
                    });

                }
            }
            // search albums
            if (searchType === 'album' || searchType === 'song') {
                artist.albums.forEach(album => {
                    const albumtWords = album.title.toLowerCase().split(' ');
                    const albumbasicMacth = album.title.toLowerCase().includes(searchWords);
                    const albumWordMatch = searchWords.length > 0 && searchWords.every(w => album.title.toLowerCase().includes(w));
                    const unorderedAlbumMatch = searchWords.every(searchw =>
                        albumtWords.some(albumw => albumw.includes(searchw)))

                    if (albumbasicMacth || albumWordMatch || unorderedAlbumMatch) {
                        searchResults.push({
                            type: 'album',
                            artistName: artist.name,
                            name: album.title,
                            display: `${album.title} - ${artist.name}`,
                            basicMatch: albumbasicMacth,
                            wordMatch: albumWordMatch,
                            unorderedMatch: unorderedAlbumMatch
                        });
                    }
                    // search song
                    if (searchType === 'song') {
                        album.songs.forEach(song => {
                            const songWords = song.title.toLowerCase().split(' ');
                            const songbasicMacth = song.title.toLowerCase().includes(searchWords);
                            const songWordMatch = searchWords.every(w => album.title.toLowerCase().includes(w));
                            const unorderedSongMatch = searchWords.every(searchw =>
                                songWords.some(songw => songw.includes(searchw)))
                            if (songbasicMacth || songWordMatch || unorderedSongMatch) {
                                searchResults.push({
                                    type: 'song',
                                    name: song.title,
                                    artistName: artist.name,
                                    albumName: album.title,
                                    display: `${song.title} - ${artist.name}`,
                                    basicMatch: songbasicMacth,
                                    wordMatch: songWordMatch,
                                    unorderedMatch: unorderedSongMatch
                                });
                            }
                        });
                    }
                }
                );
            }
        });

        // sort the search result  basic > word >unorder
        searchResults.sort((a, b) => {
            if (a.basicMacth !== b.basicMacth) {
                return a.basicMatch ? -1 : 1;
            }
            if (a.wordMatch !== b.wordMatch) {
                return a.wordMatch ? -1 : 1;
            }
            if (a.unorderedMatch !== b.unorderedMatch) {
                return a.unorderedMatch ? -1 : 1;
            }
            return 0;
        })
        searchResults = searchResults.slice(0, 10);
        setOptions(searchResults);
    };

    // function to find the select data
    const handleSelection = (e, value) => {
        if (!value) {
            setSelection(null);
            return;
        }

        switch (value.type) {
            case 'artist':
                const artistData = musicData.find(artist => artist.name === value.name);
                setSelection({
                    type: 'artist',
                    data: artistData
                });
                break;
            case 'album':
                const artistWithAlbum = musicData.find(artist => artist.name === value.artistName);
                const albumData = artistWithAlbum.albums.find(album => album.title === value.name);
                setSelection({
                    type: 'album',
                    data: albumData,
                    artistName: value.artistName
                });
                break;
            case 'song':
                const artistWithsong = musicData.find(artist => artist.name === value.artistName);
                const albumWithsong = artistWithsong.albums.find(album => album.title === value.albumName);
                const songData = albumWithsong.songs.find(song => song.title === value.name);
                setSelection({
                    type: 'song',
                    data: songData,
                    albumName: value.albumName,
                    artistName: value.artistName
                });
                break;
        }
    };

    return (
        <div className='searchDropdown'>
            <Grid className="search-container" container>
                <Box item>
                    <FormControl>
                        <InputLabel id="search-type-label">Type</InputLabel>
                        <Select
                            labelId="search-type-label"
                            value={searchType}
                            label="search type"
                            onChange={handleSearchTypeChange}>
                            {searchTypes.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Grid item>
                    <Autocomplete
                        key={searchType}
                        disablePortal
                        options={options}
                        sx={{ width: 300 }}
                        // freeSolo={true}
                        onInputChange={(event, newValue) => {
                            handleInput(event, newValue);
                        }}
                        onChange={handleSelection}
                        inputValue={inputValue}
                        getOptionLabel={(option) => option.display || ''}
                        filterOptions={(options) => options}
                        renderInput={(params) => <TextField {...params} label="Search" />}
                    />
                </Grid>

            </Grid>
            <Grid className="info-container" container spacing={2}>
                {selection && (
                    <div className='music-info'>
                        {selection.type === 'artist' && (
                            <Grid item xs={12}>
                                <Card className="artist-card">
                                    <CardContent>
                                        <Typography variant="h5">{selection.data.name}</Typography>
                                    </CardContent>
                                </Card>
                                {selection.data.albums.map((album, index) => (
                                    <Accordion key={index} className="album-accordion">
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`album-content-${index}`} id={`album-header-${index}`}>
                                            <Typography variant="h6">{album.title}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>{album.description}</Typography>
                                            <ul>
                                                {album.songs.map((song, idx) => (
                                                    <li key={idx}>
                                                        <Typography variant="body2">
                                                            {song.title} - {song.length}
                                                        </Typography>
                                                    </li>
                                                ))}
                                            </ul>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}

                            </Grid>
                        )}
                        {selection.type === 'album' && (
                           <Grid item xs={12}>
                           <Card className="album-card">
                             <CardContent>
                               <Typography variant="h5">{selection.data.title}</Typography>
                               <Typography variant="h6">Artist: {selection.artistName}</Typography>
                               <Typography >{selection.data.description}</Typography>
                             </CardContent>
                           </Card>
                           <Accordion className="songs-accordion">
                             <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="songs-content" id="songs-header">
                               <Typography variant="h6">Songs</Typography>
                             </AccordionSummary>
                             <AccordionDetails>
                               <ul>
                                 {selection.data.songs.map((song, idx) => (
                                   <li key={idx}>
                                     <Typography variant="body2">
                                       {song.title} - {song.length}
                                     </Typography>
                                   </li>
                                 ))}
                               </ul>
                             </AccordionDetails>
                           </Accordion>
                         </Grid>
                        )}
                        {selection.type === 'song' && (
                            <Grid item xs={12}>
                            <Card className="song-card">
                              <CardContent>
                                <Typography variant="h5"> {selection.data.title}</Typography>
                                <Typography variant="h6">Album: {selection.albumName}</Typography>
                                <Typography variant="p">Artist: {selection.artistName}</Typography>
                                <Typography>Length: {selection.data.length}</Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        )}
                    </div>
                )}
            </Grid>

        </div>
    );
}