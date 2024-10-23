import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


export default function SearchDropdown() {
   const [musicData, setMusicData] = React.useState([]);
   const [options, setOptions] = React.useState([]);

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
// handle the input changes

//    const test = (e) => {
//     let text = e.target.value;
//     let result = artNames.map();
//     setOptions(result)
//    }
   const handleInput = (event, value) =>{
    console.log(value);
    if(value){
        const result = artNames.filter((name) => 
            name.toLowerCase().includes(value.toLowerCase())
        );
        setOptions(result);
    }else{
        setOptions([]); 
    }
   };

   return(
    <Autocomplete
      disablePortal
      options={options}
      sx={{ width: 300 }}
      onInputChange={handleInput}
      renderInput={(params) => <TextField {...params} label="Artist" />}
    />
   );
}