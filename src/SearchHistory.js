
const MAX_HISTORY = 10;

// load search history from local 

export const loadSearchHistory = (type = 'name') => {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    return history
        .filter(h => h.type === type)
        .map(h => ({
            type: type,
            name: h.name,
            display: h.display,
            fromHistory: true
        }));
};

// save Search History 
export const saveSearchHistory = (searchType, name, display, fromHistory) => {
    const newEntry = { type: searchType, name: name, display: display, fromHistory: fromHistory };
    const history = loadSearchHistory(searchType);

    // updated history
    const updatedHistory = [newEntry, ...history.filter(entry => entry.name !== name)]
        .slice(0, MAX_HISTORY);

    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    return updatedHistory;
};

// clear
export const clearSearchHistory = () => {
    localStorage.removeItem('searchHistory');
};
