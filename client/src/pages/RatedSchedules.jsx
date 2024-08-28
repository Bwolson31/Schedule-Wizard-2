import React, { useState, useEffect } from 'react';
import './RatedSchedules.css';
import { useQuery } from '@apollo/client';
import { Container, Row, Col, Card, ListGroup, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { GET_RATED_SCHEDULES } from '../graphql/queries';
import SortingComponent from '../components/schedules/SortingComponent';

function RatedSchedules() {
  // State variables to manage sorting criteria
  // Adjust these initial values to match the updated enums in your schema
  const [sortBy, setSortBy] = useState('DateCreated');
  const [sortOrder, setSortOrder] = useState('NewestFirst');

  // GraphQL query to fetch rated schedules, with sorting variables and authorization header
  const { loading, error, data, refetch } = useQuery(GET_RATED_SCHEDULES, {
    variables: { sortBy, sortOrder },
    context: {
      headers: {
        authorization: `Bearer ${localStorage.getItem('id_token')}`,
      },
    },
  });

  // useEffect to refetch data whenever sortBy or sortOrder changes
  useEffect(() => {
    refetch({ sortBy, sortOrder });
  }, [sortBy, sortOrder, refetch]);

  // Display loading message while data is being fetched
  if (loading) {
    return (
      <Container className="text-center my-5">
        <div>Loading...</div>
      </Container>
    );
  }

  // Display error message if an error occurred during data fetching
  if (error) {
    console.log("Error loading rated schedules: ", error);
    return (
      <Container className="my-5">
        <Alert variant="danger">Error loading rated schedules: {error.message}</Alert>
      </Container>
    );
  }

  // Extract rated schedules data from the response
  const ratedSchedules = data?.getRatedSchedules || [];

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <h2 className="text-center mb-4 text-success">Rated Schedules</h2>
          {/* SortingComponent for sorting schedules */}
          <SortingComponent sortBy={sortBy} setSortBy={setSortBy} sortOrder={sortOrder} setSortOrder={setSortOrder} />
          {/* Display message if there are no rated schedules */}
          {ratedSchedules.length === 0 ? (
            <Alert variant="info">No rated schedules available</Alert>
          ) : (
            // Display each rated schedule
            ratedSchedules.map((entry, index) => {
              const { schedule, rating } = entry || {};
              // Skip invalid entries
              if (!schedule || !schedule._id) {
                console.warn(`Entry at index ${index} does not have a valid schedule:`, entry);
                return null;
              }
              return (
                <Card key={schedule._id} className="mb-3">
                  <Card.Header as="h5" className="bg-success text-white">
                    <Link to={`/schedule/${schedule._id}`} className="text-white">
                      {schedule.title}
                    </Link>
                  </Card.Header>
                  <Card.Body>
                    {/* Display user rating for the schedule */}
                    {rating && <p>Your rating: {rating}</p>}
                  </Card.Body>
                  <ListGroup variant="flush">
                    {/* Display activities in the schedule */}
                    {schedule.activities && schedule.activities.length > 0 ? (
                      schedule.activities.map(activity => (
                        <ListGroup.Item key={activity._id}>
                          {activity.title}
                        </ListGroup.Item>
                      ))
                    ) : (
                      <ListGroup.Item>No activities available</ListGroup.Item>
                    )}
                  </ListGroup>
                </Card>
              );
            })
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default RatedSchedules;