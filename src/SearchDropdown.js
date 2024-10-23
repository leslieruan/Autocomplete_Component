import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


export default function SearchDropdown() {
   const [musicData, setMusicData] = React.useState([]);
   const [options, setOptions] = React.useState([]);
   const [selection, setSelection] = React.useState(null);

   React.useEffect(() =>{
    // fetch the local json data
    fetch('./data.json')
        .then((response) => {
            if(!response.ok){
                throw new console.error('response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            setMusicData(data);
        })
        .catch((error) =>{
            console.error("Error fetching the data:", error);
        })
   }, []);


   const artNames = musicData.map((artist) => artist.name);


//    const test = (e) => {
//     let text = e.target.value;
//     let result = artNames.map();
//     setOptions(result)
//    }

// function to handle the input changes
   const handleInput = (event, value) =>{
    if(value){
        const result = artNames.filter((name) => 
            name.toLowerCase().includes(value.toLowerCase())
        );
        setOptions(result);
    }else{
        setOptions([]); 
    }
};

 // function to find the select data
 const handleSelection = (event, value) =>{
    if(value){
        const selectResult = musicData.find(e => e.name === value);
        setSelection(selectResult);
    }
    else {
        setSelection(null); 
    }
};

   return(
    <div className='searchDropdown'>
    <Autocomplete
      disablePortal
      options={options}
      sx={{ width: 300 }}
      onInputChange={handleInput}
      onChange={handleSelection}
      renderInput={(params) => <TextField {...params} label="Search" />}
    />
    {selection && (
        <div className='music-info'>
            <h4>Artist: {selection.name}</h4>
            {selection.albums.map((album, index) => (
                <div key={index} className="album-info">
                    <h5>Album: {album.title}</h5>
                    <p>{album.description}</p>
                    <ul>
                    {album.songs.map((song, idx) => (
                                    <li key={idx}>
                                        {song.title} - {song.length}
                                    </li>
                                ))}
                    </ul>
                </div>
            ))
            }
        </div> 
    )}
    </div>
   );
}