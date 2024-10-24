import * as React from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { WorkOffRounded } from '@mui/icons-material';


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
        const searcWords = searchTxt.split(' ').filter(word => word.length > 0);

        let searchResults = [];
       
        musicData.forEach(artist => {
            if (searchType === 'name'){
            const artistWords = artist.name.toLowerCase().split(' ');
            const basiMacth = artist.name.toLowerCase().includes(searcWords);
            const wordMatch = searcWords.every(w => artist.name.toLowerCase().includes(w));
            const unorderedMatch = searcWords.every(searchw => 
                artistWords.some(artistw => artistw.includes(searchw)))
            // search artist 
            if (basiMacth || wordMatch || unorderedMatch) {
               
                    searchResults.push({
                        type: 'artist',
                        name: artist.name,
                        display: `${artist.name}`
                    });
                
            }
        }
            // search albums
            if (searchType === 'album' || searchType === 'song'){
                artist.albums.forEach(album => {
                    const albumtWords = album.title.toLowerCase().split(' ');
                    const albumBasiMacth = album.title.toLowerCase().includes(searcWords);
                    const albumWordMatch = searcWords.every(w =>  album.title.toLowerCase().includes(w));
                    const unorderedAlbumMatch = searcWords.every(searchw => 
                        albumtWords.some(albumw => albumw.includes(searchw))  )

                    if (albumBasiMacth || albumWordMatch ||unorderedAlbumMatch) {
                        searchResults.push({
                            type: 'album',
                            artistName: artist.name,
                            name: album.title,
                            display: `${album.title} - ${artist.name}`
                        });
                    }
                    // search song
                    if(searchType === 'song'){
                        album.songs.forEach(song => {
                            const songWords = song.title.toLowerCase().split(' ');
                            const songBasiMacth = song.title.toLowerCase().includes(searcWords);
                            const songWordMatch = searcWords.every(w =>  album.title.toLowerCase().includes(w));
                            const unorderedSongMatch = searcWords.every(searchw => 
                                songWords.some(songw => songw.includes(searchw))  )
                            if (songBasiMacth || songWordMatch ||unorderedSongMatch) {
                                searchResults.push({
                                    type: 'song',
                                    name: song.title,
                                    artistName: artist.name,
                                    albumName: album.title,
                                    display: `${song.title} - ${artist.name}`
                                });
                            }
                        });
                    }
                    }
                );
            }
        });
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
            <Box>
                <FormControl>
                    <InputLabel id="search-type-label">Search Type</InputLabel>
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
            <Autocomplete
                key={searchType} 
                disablePortal
                options={options}
                sx={{ width: 300 }}
                onInputChange={handleInput}
                onChange={handleSelection}
                inputValue={inputValue}
                getOptionLabel={(option) => option.display || ''}
                renderInput={(params) => <TextField {...params} label="Search" />}
            />
            {selection && (
                <div className='music-info'>
                    {selection.type === 'artist' && (
                        <div>
                            <h4>Artist:{selection.data.name}</h4>
                            {selection.data.albums.map((album, index) => (
                                <div key={index} className="album-info">
                                    <h5>album:{album.title}</h5>
                                    <p>{album.description}</p>
                                    <ul>
                                        {album.songs.map((song, idx) => (
                                            <li key={idx}>
                                                {song.title} - {song.length}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                    {selection.type === 'album' && (
                        <div>
                            <h4>album: {selection.data.title}</h4>
                            <h5>artist: {selection.artistName}</h5>
                            <p>{selection.data.description}</p>
                            <ul>
                                {selection.data.songs.map((song, idx) => (
                                    <li key={idx}>
                                        {song.title} - {song.length}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {selection.type === 'song' && (
                        <div>
                            <h4>Song: {selection.data.title}</h4>
                            <h4>Album: {selection.albumName}</h4>
                            <h5>Artist: {selection.artistName}</h5>
                            <p>{selection.data.length}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}