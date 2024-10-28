import * as React from 'react';
import { Box } from '@mui/material';
import { Grid } from '@mui/system';

import SearchTypeSelect from './SearchTypeSelect';
import SearchInput from './SearchInput';
import ArtistInfo from './ArtistInfo';
import AlbumInfo from './AlbumInfo';
import SongInfo from './SongInfo';
import { loadSearchHistory, saveSearchHistory } from './SearchHistory'


export default function SearchDropdown() {
    const [musicData, setMusicData] = React.useState([]);
    const [options, setOptions] = React.useState(loadSearchHistory('name'));
    const [selection, setSelection] = React.useState(null);
    const [searchType, setSearchType] = React.useState('name');
    const [inputValue, setInputValue] = React.useState('');
    const [searchHistory, setSearchHistory] = React.useState([]);


    React.useEffect(() => {
        // load search history
        setSearchHistory(loadSearchHistory(searchType));
        // fetch the local json data
        fetch('http://localhost:5000/api/artists')
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



    const handleSearchTypeChange = (e) => {
        const newType = e.target.value;
        setSearchType(newType);
        setOptions(loadSearchHistory(newType));
        setSelection(null);
        setInputValue('');
    }


    // function to handle the input changes
    const handleInput = (e, value) => {
        setInputValue(value);
        if (!value) {
            setOptions(options);
            return;
        }

        const searchTxt = value.toLowerCase();
        // only filter the empty strings 
        const searchWords = searchTxt.split(' ').filter(word => word !== ' ');
        let searchResults = [];

        // helper function to match search history
        const currentHistory = loadSearchHistory(searchType);
        const historyMatches = currentHistory
            .filter(entry => entry.name.toLowerCase().includes(searchTxt))
            .map(entry => ({
                type: searchType,
                name: entry.name,
                display: entry.display,
                fromHistory: true
            }));

        searchResults.push(...historyMatches);

        // Helper function to match artist
        const matchArtist = (artist, searchWords, searchTxt) => {
            const artistWords = artist.name.toLowerCase().split(' ');
            const basicMatch = artist.name.toLowerCase().includes(searchTxt);
            const wordMatch = searchWords.every(w => artist.name.toLowerCase().includes(w));
            const unorderedMatch = searchWords.every(searchWord =>
                artistWords.some(artistWord => artistWord.includes(searchWord))
            );

            if (basicMatch || wordMatch || unorderedMatch) {
                return {
                    type: 'artist',
                    name: artist.name,
                    display: artist.name,
                    basicMatch,
                    wordMatch,
                    unorderedMatch
                };
            }
            return null;
        };

        // Helper function to match song
        const matchSong = (song, artistName, albumTitle, searchWords, searchTxt) => {
            const songWords = song.title.toLowerCase().split(' ');
            const songbasicMatch = song.title.toLowerCase().includes(searchTxt);
            const songWordMatch = searchWords.every(w => song.title.toLowerCase().includes(w));
            const unorderedSongMatch = searchWords.every(searchWord =>
                songWords.some(songWord => songWord.includes(searchWord))
            );

            if (songbasicMatch || songWordMatch || unorderedSongMatch) {
                return {
                    type: 'song',
                    name: song.title,
                    artistName,
                    albumName: albumTitle,
                    display: `${song.title} - ${artistName}`,
                    basicMatch: songbasicMatch,
                    wordMatch: songWordMatch,
                    unorderedMatch: unorderedSongMatch
                };
            }
            return null;
        };
        // Helper function to match album
        const matchAlbum = (album, artistName, searchWords, searchTxt) => {
            const albumWords = album.title.toLowerCase().split(' ');
            const albumbasicMatch = album.title.toLowerCase().includes(searchTxt);
            const albumWordMatch = searchWords.every(w => album.title.toLowerCase().includes(w));
            const unorderedAlbumMatch = searchWords.every(searchWord =>
                albumWords.some(albumWord => albumWord.includes(searchWord))
            );

            if (albumbasicMatch || albumWordMatch || unorderedAlbumMatch) {
                return {
                    type: 'album',
                    artistName,
                    name: album.title,
                    display: `${album.title} - ${artistName}`,
                    basicMatch: albumbasicMatch,
                    wordMatch: albumWordMatch,
                    unorderedMatch: unorderedAlbumMatch
                };
            }
            return null;
        };

        musicData.forEach(artist => {
            if (searchType === 'name') {
                const artistMatch = matchArtist(artist, searchWords, searchTxt);
                if (artistMatch) searchResults.push(artistMatch);
            } else if (searchType === 'album') {
                artist.albums.forEach(album => {
                    const albumMatch = matchAlbum(album, artist.name, searchWords, searchTxt);
                    if (albumMatch) searchResults.push(albumMatch);
                });
            } else if (searchType === 'song') {
                artist.albums.forEach(album => {
                    album.songs.forEach(song => {
                        const songMatch = matchSong(song, artist.name, album.title, searchWords, searchTxt);
                        if (songMatch) searchResults.push(songMatch);
                    });
                });
            }
        });

        // update the results
        let combinedResults =[...currentHistory, ...searchResults];
        const uniqueResults = Array.from(new Map(combinedResults.map(item => [item.name, item])).values());

        // sort the search result  basic > word >unorder
        uniqueResults.sort((a, b) => {
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
        searchResults = uniqueResults.slice(0, 10);
        setOptions(uniqueResults);
    };

    // function to find the select data
    const handleSelection = (e, value) => {
        if (!value) {
            setSelection(null);
            setOptions(loadSearchHistory(searchType));
            console.log(options);
            return;
        }
        if (!value.fromHistory) {
            const updatedHistory = saveSearchHistory(searchType, value.name, value.name, true);
            setSearchHistory(updatedHistory);
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
            default:
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