import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    // Fetch search history when the app loads
    const fetchSearchHistory = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:8080/history/get', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSearchHistory(response.data.searchHistory);
  } catch (err) {
    console.error('Failed to fetch search history:', err);
  }
};

    fetchSearchHistory();
  }, []);

  const addToFavorites = (country) => {
    setFavorites((prev) => {
      if (!prev.some((item) => item.cca2 === country.cca2)) {
        return [...prev, country];
      }
      return prev;
    });
  };
  
  const removeFromFavorites = (country) => {
    setFavorites((prev) => prev.filter((item) => item.cca2 !== country.cca2));
  };

  const addToSearchHistory = async (search) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8080/history/store', { searchTerm: search }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchHistory(response.data.searchHistory); // Update history from response
    } catch (err) {
      console.error('Failed to add search term to history:', err);
    }
  };

  const clearSearchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:8080/history/clear', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchHistory([]); // Clear history locally
    } catch (err) {
      console.error('Failed to clear search history:', err);
    }
  };

  return (
    <AppContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, searchHistory, addToSearchHistory, clearSearchHistory }}>
      {children}
    </AppContext.Provider>
  );
};
