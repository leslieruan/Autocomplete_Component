
const MAX_HISTORY = 10;

// load search history from local 
export const loadSearchHistory = () => {
    return JSON.parse(localStorage.getItem('searchHistory')) || [];
};

// save Search History 
export const saveSearchHistory = (searchType, searchQuery) => {
    const newEntry = { type: searchType, query: searchQuery };
    const history = loadSearchHistory();

    // updated history
    const updatedHistory = [newEntry, ...history.filter(entry => entry.query !== searchQuery)]
        .slice(0, MAX_HISTORY); 

    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    return updatedHistory;
};

// clear 
export const clearSearchHistory = () => {
    localStorage.removeItem('searchHistory');
};
