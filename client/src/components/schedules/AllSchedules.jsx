import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SCHEDULES } from '../../graphql/queries';
import { Link } from 'react-router-dom';
import { ListGroup, Container, Row, Col, Spinner, Alert, DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function AllSchedules() {
  // State variables to control sorting options
  const [sortBy, setSortBy] = useState('CREATED_AT');
  const [sortOrder, setSortOrder] = useState('DESC');

  // useQuery hook to fetch schedules data with sorting options
  const { loading, error, data } = useQuery(GET_SCHEDULES, {
    variables: { sortBy, sortOrder },
    pollInterval: 500, // Polling interval to keep data updated
  });

  // Handler to change the sorting field
  const handleSortChange = (sortField) => {
    setSortBy(sortField);
  };

  // Handler to change the sorting order
  const handleOrderChange = (order) => {
    setSortOrder(order);
  };

  // Render a loading spinner while data is being fetched
  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" style={{ color: 'green' }}>
          <span className="visually-hidden">Loading schedules...</span>
        </Spinner>
      </Container>
    );
  }

  // Render an error message if there's an issue fetching the data
  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">Error loading schedules: {error.message}</Alert>
      </Container>
    );
  }

  // Render the list of schedules with sorting options
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="my-4 text-center" style={{ color: 'green' }}>All Schedules</h2>
          
          {/* Dropdown for sorting by different fields */}
          <DropdownButton id="sort-by" title={`Sort by: ${sortBy}`} className="mb-3">
            <Dropdown.Item onClick={() => handleSortChange('CREATED_AT')}>Created At</Dropdown.Item>
            <Dropdown.Item onClick={() => handleSortChange('UPDATED_AT')}>Updated At</Dropdown.Item>
            <Dropdown.Item onClick={() => handleSortChange('TITLE')}>Title</Dropdown.Item>
            <Dropdown.Item onClick={() => handleSortChange('RATING')}>Rating</Dropdown.Item>
          </DropdownButton>
          
          {/* Dropdown for sorting order */}
          <DropdownButton id="sort-order" title={`Order: ${sortOrder}`} className="mb-3">
            <Dropdown.Item onClick={() => handleOrderChange('ASC')}>Ascending</Dropdown.Item>
            <Dropdown.Item onClick={() => handleOrderChange('DESC')}>Descending</Dropdown.Item>
          </DropdownButton>
          
          {/* List of schedules */}
          <ListGroup>
            {data.getSchedules.map(schedule => (
              <ListGroup.Item key={schedule._id} className="border border-success text-center">
                <Link to={`/schedule/${schedule._id}`} className="text-decoration-none" style={{ color: 'green' }}>
                  {schedule.title}
                </Link>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default AllSchedules;
