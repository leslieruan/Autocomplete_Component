/** Maximum number of entries to store in search history */
const MAX_HISTORY = 10;

/**
 * Loads search history from local storage for a specific search type
 * Filters and formats history entries based on the provided type
 * 
 * @param {string} type - The type of search history to load (default: 'name')
 * @returns {Array} Filtered and formatted history entries
 */
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

/**
 * Saves a new entry to search history
 * Maintains uniqueness by removing duplicate entries
 * Limits history size to MAX_HISTORY entries
 * 
 * @param {string} searchType - Type of search (artist, album, song)
 * @param {string} name - Name/title of the searched item
 * @param {string} display - Display text for the history entry
 * @param {boolean} fromHistory - Indicates if entry is from history
 * @returns {Array} Updated history entries
 */
export const saveSearchHistory = (searchType, name, display, fromHistory) => {
    const newEntry = { type: searchType, name: name, display: display, fromHistory: fromHistory };
    const history = loadSearchHistory(searchType);
    // Combine new entry with existing history, remove duplicates, and limit size
    const updatedHistory = [newEntry, ...history.filter(entry => entry.name !== name)]
        .slice(0, MAX_HISTORY);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    return updatedHistory;
};

/**
 * Clears all search history from local storage
 */
export const clearSearchHistory = () => {
    localStorage.removeItem('searchHistory');
};
