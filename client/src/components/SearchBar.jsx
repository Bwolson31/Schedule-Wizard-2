import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_SCHEDULES, SEARCH_USERS } from '../graphql/queries';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';  

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Lazy query for searching schedules
  const [searchSchedules] = useLazyQuery(SEARCH_SCHEDULES, {
    onCompleted: (scheduleData) => {
      // After searching for schedules, we can update the state to include schedules
      navigate(`/search?searchTerm=${searchTerm}`, { state: { schedules: scheduleData.searchSchedules } });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // Lazy query for searching users
  const [searchUsers] = useLazyQuery(SEARCH_USERS, {
    onCompleted: (userData) => {
      // After searching for users, we can update the state to include users
      navigate(`/search?searchTerm=${searchTerm}`, { state: { users: userData.searchUsers } });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // Execute both queries for schedules and users
    searchSchedules({
      variables: {
        query: searchTerm,
        category: null,
        tags: [],
        sortBy: 'DateCreated',
        sortOrder: 'NewestFirst',
      },
    });
    searchUsers({ variables: { term: searchTerm } });
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
