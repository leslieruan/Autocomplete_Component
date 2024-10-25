import * as React from 'react';
import { Box } from '@mui/material';
import { Grid } from '@mui/system';

import SearchTypeSelect from './SearchTypeSelect';
import SearchInput from './SearchInput';
import ArtistInfo from './ArtistInfo';
import AlbumInfo from './AlbumInfo';
import SongInfo from './SongInfo';



export default function SearchDropdown() {
    const [musicData, setMusicData] = React.useState([]);
    const [options, setOptions] = React.useState([]);
    const [selection, setSelection] = React.useState(null);
    const [searchType, setSearchType] = React.useState('name');
    const [inputValue, setInputValue] = React.useState('');

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
            if (searchType === 'album') {
                artist.albums.forEach(album => {
                    const albumtWords = album.title.toLowerCase().split(' ');
                    const albumbasicMacth = album.title.toLowerCase().includes(searchWords);
                    const albumWordMatch = searchWords.every(w => album.title.toLowerCase().includes(w));
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
                }
                );
            }
            // search song
            if (searchType === 'song') {
                artist.albums.forEach(album => {
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
                });
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
        <div className="searchDropdown">
            <Grid className="search-container" container>
                <Box item>
                    <SearchTypeSelect searchType={searchType} handleSearchTypeChange={handleSearchTypeChange} />
                </Box>
                <Grid item>
                    <SearchInput
                        searchType={searchType}
                        options={options}
                        inputValue={inputValue}
                        handleInput={handleInput}
                        handleSelection={handleSelection}
                    />
                </Grid>
            </Grid>

            <Grid className="info-container" container spacing={2}>
                {selection && (
                    <div className="music-info">
                        {selection.type === 'artist' && <ArtistInfo artist={selection.data} />}
                        {selection.type === 'album' && (
                            <AlbumInfo album={selection.data} artistName={selection.artistName} />
                        )}
                        {selection.type === 'song' && (
                            <SongInfo song={selection.data} albumName={selection.albumName} artistName={selection.artistName} />
                        )}
                    </div>
                )}
            </Grid>
        </div>
    );
}