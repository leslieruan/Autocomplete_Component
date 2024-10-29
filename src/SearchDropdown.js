import * as React from 'react';
import { Box } from '@mui/material';
import { Grid } from '@mui/system';

import SearchTypeSelect from './SearchTypeSelect';
import SearchInput from './SearchInput';
import ArtistInfo from './ArtistInfo';
import AlbumInfo from './AlbumInfo';
import SongInfo from './SongInfo';
import { loadSearchHistory, saveSearchHistory } from './SearchHistory'

/**
 * Main search dropdown component that manages music search functionality
 * Supports searching by artist name, album, and song
 * Includes search history and dynamic results filtering
 */
export default function SearchDropdown() {
    const [musicData, setMusicData] = React.useState([]);
    const [options, setOptions] = React.useState(loadSearchHistory('name'));
    const [selection, setSelection] = React.useState(null);
    const [searchType, setSearchType] = React.useState('name');
    const [inputValue, setInputValue] = React.useState('');
    // Search history state is maintained but not directly used
    // eslint-disable-next-line no-unused-vars
    const [searchHistory, setSearchHistory] = React.useState([]);


    /**
      * Effect hook to fetch data and load search history
      * Triggers when search type changes
      */
    React.useEffect(() => {
        // load search history
        setSearchHistory(loadSearchHistory(searchType));
        // fetch the local json data
        fetch(`http://localhost:5001/api/artists`)
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
    }, [searchType]);


    /**
     * Handles changes in search type (artist, album, song)
     * Resets selection and input values
     */
    const handleSearchTypeChange = (e) => {
        const newType = e.target.value;
        setSearchType(newType);
        setOptions(loadSearchHistory(newType));
        setSelection(null);
        setInputValue('');
    }

    /**
      * Handles input changes in search field
      * Filters results based on search text and current search type
      */
    const handleInput = (e, value) => {
        setInputValue(value);
        if (!value) {
            setOptions(options);
            return;
        }
        const searchTxt = value.toLowerCase();
        const searchWords = searchTxt.split(' ').filter(word => word !== ' ');
        let searchResults = [];
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

        /**
         * Helper function to match search terms against target items
         * Supports matching artists, albums, and songs
         */
        const matchFunc = (target, artistName, searchWords, searchTxt, type, albumName = null) => {
            if (!target || typeof target !== 'object') {
                console.warn(`Invalid target: ${target}`);
                return null;
            }
            const targetText = type === 'artist' ? target.name : target.title;
            if (!targetText) {
                console.warn(`Invalid type, target: ${type}: ${target}`);
                return null;
            }
            const words = targetText.toLowerCase().split(' ');
            const basicMatch = targetText.toLowerCase().includes(searchTxt);
            const wordMatch = searchWords.every(w => targetText.toLowerCase().includes(w));
            const unorderedMatch = searchWords.every(searchWord =>
                words.some(word => word.includes(searchWord))
            );
            if (basicMatch || wordMatch || unorderedMatch) {
                return {
                    type: type,
                    artistName: type !== 'artist' ? artistName : undefined,
                    name: targetText,
                    albumName: type === 'song' ? albumName : undefined,
                    display: type === 'artist' ? target.name : `${target.title} - ${artistName}`,
                    basicMatch,
                    wordMatch,
                    unorderedMatch
                };
            }
            return null;
        };

        // Perform search based on current search type
        musicData.forEach(artist => {
            if (searchType === 'name') {
                const artistMatch = matchFunc(artist, null, searchWords, searchTxt, 'artist');
                if (artistMatch) searchResults.push(artistMatch);
            } else if (searchType === 'album') {
                artist.albums.forEach(album => {
                    const albumMatch = matchFunc(album, artist.name, searchWords, searchTxt, 'album');
                    if (albumMatch) searchResults.push(albumMatch);
                });
            } else if (searchType === 'song') {
                artist.albums.forEach(album => {
                    album.songs.forEach(song => {
                        const songMatch = matchFunc(song, artist.name, searchWords, searchTxt, 'song', album.title);
                        if (songMatch) searchResults.push(songMatch);
                    });
                });
            }
        });
        let combinedResults = [...currentHistory, ...searchResults];
        const uniqueResults = Array.from(new Map(combinedResults.map(item => [item.name, item])).values());

        // Sort results by match quality: basic > word > unordered
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

    /**
     * Handles selection of a search result
     * Updates search history and finds detailed information for selected item
     */
    const handleSelection = (e, value) => {
        if (!value) {
            setSelection(null);
            setOptions(loadSearchHistory(searchType));
            return;
        }
        // Save new searches to history
        if (!value.fromHistory) {
            const updatedHistory = saveSearchHistory(searchType, value.name, value.name, true);
            setSearchHistory(updatedHistory);
        }

        /**
         * Helper function to find detailed music data from full dataset
         * Supports finding artists, albums, and songs
         */
        const findMusicData = (searchValue) => {
            const findArtist = (name) => musicData.find(artist => artist.name === name);
            const findAlbum = (artist, title) => artist?.albums.find(album => album.title === title);
            const findSong = (album, title) => album?.songs.find(song => song.title === title);
            const { type, name, artistName, albumName, fromHistory } = searchValue;
            // Handle history items
            if (fromHistory) {
                switch (type) {
                    case 'artist':
                    case 'name': {
                        const artist = findArtist(name);
                        return artist ? { type: 'artist', data: artist } : null;
                    }

                    case 'album': {
                        for (const artist of musicData) {
                            const album = findAlbum(artist, name);
                            if (album) return { type: 'album', data: album, artistName: artist.name };
                        }
                        break;
                    }

                    case 'song': {
                        for (const artist of musicData) {
                            for (const album of artist.albums) {
                                const song = findSong(album, name);
                                if (song) return { type: 'song', data: song, albumName: album.title, artistName: artist.name };
                            }
                        }
                        break;
                    }
                    default:
                        console.warn(`Unexpected type: ${type}`);
                        return null;
                }
                return null;
            }
            // Handle direct type selection
            const artist = findArtist(artistName || name);
            switch (type) {
                case 'artist':
                    return artist ? { type, data: artist } : null;

                case 'album': {
                    const album = findAlbum(artist, name);
                    return album ? { type, data: album, artistName: artist.name } : null;
                }

                case 'song': {
                    const album = findAlbum(artist, albumName);
                    const song = findSong(album, name);
                    return song ? { type, data: song, artistName: artist.name, albumName: album.title } : null;
                }
                default:
                    console.warn(`Unexpected type: ${type}`);
                    return null;
            }
        };
        const result = findMusicData(value);
        if (result) {
            setSelection(result);
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