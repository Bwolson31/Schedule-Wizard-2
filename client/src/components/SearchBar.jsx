import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_SCHEDULES } from '../graphql/queries';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';  

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const [searchSchedules] = useLazyQuery(SEARCH_SCHEDULES, {
    onCompleted: (data) => {
      // Navigate to search results page and pass schedules
      navigate(`/search?searchTerm=${searchTerm}`, { state: { schedules: data.searchSchedules } });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // Execute search for schedules
    searchSchedules({
      variables: {
        query: searchTerm,
        category: null, // No category when searching via the search bar
        tags: [], // Modify as necessary to include tags
        sortBy: 'DateCreated',
        sortOrder: 'NewestFirst',
      },
    });
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch} className="input-button-container">
        <div className="input-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users, schedules, or tags..."
            className="search-input"
          />
        </div>
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
