import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Container, FormControl, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { SEARCH_USERS, SEARCH_SCHEDULES } from '../graphql/queries';

function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [searchError, setSearchError] = useState(null);

  const [searchUsers, { data: usersData, loading: loadingUsers }] = useLazyQuery(SEARCH_USERS, {
    onCompleted: (data) => {
      console.log("Users search completed successfully:", data);
      searchSchedules({ variables: { term: searchTerm } });
    },
    onError: (error) => {
      console.error("Error searching users:", error);
      setSearchError(error);
    }
  });

  const [searchSchedules, { data: schedulesData, loading: loadingSchedules }] = useLazyQuery(SEARCH_SCHEDULES, {
    onCompleted: (data) => {
      console.log("Schedules search completed successfully:", data);
      navigate('/search', {
        state: {
          users: usersData?.searchUsers || [],
          schedules: data?.searchSchedules || [],
        },
      });
    },
    onError: (error) => {
      console.error("Error searching schedules:", error);
      setSearchError(error);
    }
  });

  const handleSearch = async (event) => {
    event.preventDefault();
    console.log("Initiating search for:", searchTerm);
    setSearchError(null);
    searchUsers({ variables: { term: searchTerm } });
  };

  return (
    <header className="bg-success text-white py-4">
      <Container className="d-flex justify-content-between align-items-center">
        <div style={{ flex: 1 }}></div>
        <h1 className="mb-0 text-center" style={{ flex: 2 }}>ScheduleWizard</h1>
        <Form onSubmit={handleSearch} className="d-flex" style={{ width: '300px', flex: 'none' }}>
          <FormControl
            placeholder="Search users or schedules..."
            value={searchTerm}
            onChange={(e) => {
              console.log("Search term updated to:", e.target.value);
              setSearchTerm(e.target.value);
            }}
            className="me-2"
          />
          <Button variant="outline-light" type="submit" disabled={loadingUsers || loadingSchedules}>
            {loadingUsers || loadingSchedules ? <Spinner size="sm" animation="border" /> : 'Search'}
          </Button>
        </Form>
        {searchError && <Alert variant="danger">Error: {searchError.message}</Alert>}
      </Container>
    </header>
  );
}

export default Header;
