import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { SEARCH_USERS, SEARCH_SCHEDULES } from '../graphql/queries';

function SearchResultsPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchTerm = params.get('searchTerm') || '';
  const category = params.get('category');

  // Query for fetching users by searchTerm
  const { loading: usersLoading, error: usersError, data: usersData } = useQuery(SEARCH_USERS, {
    variables: { term: searchTerm },
    skip: !searchTerm, // Only run this query if searchTerm is present
  });

  // Query for fetching schedules by searchTerm
  const { loading: schedulesLoading, error: schedulesError, data: schedulesData } = useQuery(SEARCH_SCHEDULES, {
    variables: { query: searchTerm, category },
    skip: !searchTerm && !category, 
  });
  

  // Get users and schedules from the data
  const users = usersData?.searchUsers || [];
  const schedules = schedulesData?.searchSchedules || [];

  // Loading and error handling
  const loading = usersLoading || schedulesLoading;
  const error = usersError || schedulesError;

  return (
    <Container>
      <h1 className="text-center mb-5" style={{ color: 'green' }}>
        Search Results for "{searchTerm}"
      </h1>
      <Row>
        <Col>
          <h2 className="mb-3" style={{ color: 'green' }}>Users</h2>
          {loading ? (
            <Spinner animation="border" role="status" style={{ color: 'green' }}>
              <span className="visually-hidden">Loading users...</span>
            </Spinner>
          ) : error ? (
            <Alert variant="danger">Error loading users: {error.message}</Alert>
          ) : users.length === 0 ? (
            <p>No users found</p>
          ) : (
            users.map((user) => (
              <Card key={user._id} className="mb-3" border="success">
                <Card.Body>
                  <Card.Title>
                    <Link to={`/profile/${user.username}`} style={{ color: 'green' }}>
                      {user.username}
                    </Link>
                  </Card.Title>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
        <Col>
          <h2 className="mb-3" style={{ color: 'green' }}>Schedules</h2>
          {loading ? (
            <Spinner animation="border" role="status" style={{ color: 'green' }}>
              <span className="visually-hidden">Loading schedules...</span>
            </Spinner>
          ) : error ? (
            <Alert variant="danger">Error loading schedules: {error.message}</Alert>
          ) : schedules.length === 0 ? (
            <p>No schedules found</p>
          ) : (
            schedules.map((schedule) => (
              <Card key={schedule._id} className="mb-3" border="success">
                <Card.Body>
                  <Card.Title>
                    <Link to={`/schedule/${schedule._id}`} style={{ color: 'green' }}>
                      {schedule.title}
                    </Link>
                  </Card.Title>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default SearchResultsPage;