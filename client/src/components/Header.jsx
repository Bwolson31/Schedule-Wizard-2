import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import SearchBar from './SearchBar';  
import './Header.css';  

function Header() {
  const navigate = useNavigate();


  const handleSearchResults = ({ users, schedules }) => {
    navigate('/search', {
      state: {
        users: users || [],
        schedules: schedules || [],
      },
    });
  };

  return (
    <header className="custom-header">
      <Container className="d-flex justify-content-between align-items-center">
        <div style={{ flex: 1 }}></div> 
        {/* Use the SearchBar component and pass the search results handler */}
        <SearchBar onSearchResults={handleSearchResults} />
      </Container>
    </header>
  );
}

export default Header;
