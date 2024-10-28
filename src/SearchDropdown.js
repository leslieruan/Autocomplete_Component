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

    // function to fetch the data and load the searched history data
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


    // function to hande the Search Type Change
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

        // helper function to match artists, albums, and songs
        const matchFunc = (target, artistName, searchWords, searchTxt, type,albumName = null) => {
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
        //  match search 
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
                        const songMatch = matchFunc(song, artist.name, searchWords, searchTxt, 'song',album.title);
                        if (songMatch) searchResults.push(songMatch);
                    });
                });
            }
        });

        // update the results
        let combinedResults = [...currentHistory, ...searchResults];
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
        return;
    }

    // Save to history if it's a new search
    if (!value.fromHistory) {
        const updatedHistory = saveSearchHistory(searchType, value.name, value.name, true);
        setSearchHistory(updatedHistory);
    }

    // Helper function to find music data from full dataset
    const findMusicData = (searchValue) => {
        const { type, name, artistName, albumName } = searchValue;
        
        // For history items, we only have the name and type
        if (searchValue.fromHistory) {
            switch (type) {
                case 'artist':
                case 'name':
                    const artist = musicData.find(a => a.name === name);
                    return { type: 'artist', data: artist };

                case 'album':
                    for (const artist of musicData) {
                        const album = artist.albums.find(a => a.title === name);
                        if (album) {
                            return { 
                                type: 'album', 
                                data: album, 
                                artistName: artist.name 
                            };
                        }
                    }
                    break;

                case 'song':
                    for (const artist of musicData) {
                        for (const album of artist.albums) {
                            const song = album.songs.find(s => s.title === name);
                            if (song) {
                                return { 
                                    type: 'song', 
                                    data: song, 
                                    albumName: album.title,
                                    artistName: artist.name 
                                };
                            }
                        }
                    }
                    break;
            }
            return null;
        }

        // For direct selection, we have all the necessary information
        switch (type) {
            case 'artist':
                const artist = musicData.find(a => a.name === name);
                return { type, data: artist };

            case 'album': {
                const artist = musicData.find(a => a.name === artistName);
                const album = artist?.albums.find(a => a.title === name);
                return album ? { 
                    type, 
                    data: album, 
                    artistName: artist.name 
                } : null;
            }

            case 'song': {
                const artist = musicData.find(a => a.name === artistName);
                const album = artist?.albums.find(a => a.title === albumName);
                const song = album?.songs.find(s => s.title === name);
                return song ? { 
                    type, 
                    data: song, 
                    artistName: artist.name ,
                    albumName: album.title,
                    songName: song.title 
                } : null;
            }
        }
    };

    // Set selection based on found data
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