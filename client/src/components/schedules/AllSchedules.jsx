import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SCHEDULES } from '../../graphql/queries';
import { Link } from 'react-router-dom';
import { ListGroup, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import StarRating from './StarRating';
import SortingComponent from './SortingComponent';
import HashtagLink from '../HashtagLink';
import CategoryLink from '../CategoryLink';
import './AllSchedules.css';


function AllSchedules() {
  const [sortBy, setSortBy] = useState('DateCreated');
  const [sortOrder, setSortOrder] = useState('NewestFirst');

  const { loading, error, data } = useQuery(GET_SCHEDULES, {
    variables: { category: 'ALL', query: '', tags: [], sortBy: 'DateCreated', sortOrder: 'NewestFirst' },
    pollInterval: 500,
  });
  

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" style={{ color: 'green' }}>
          <span className="visually-hidden">Loading schedules...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">Error loading schedules: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="my-4 text-center" style={{ color: 'green' }}>All Schedules</h2>
          <SortingComponent sortBy={sortBy} setSortBy={setSortBy} sortOrder={sortOrder} setSortOrder={setSortOrder} />
          <ListGroup>
            {data.getSchedules.map(schedule => (
              <ListGroup.Item key={schedule._id} className="border border-success text-center">
                <Link to={`/schedule/${schedule._id}`} className="text-decoration-none" style={{ color: 'green' }}>
                  {schedule.title}</Link>
                  <div className="category-container">
                  {schedule.category ? (
                    <CategoryLink category={schedule.category} />
                  ) : (
                    <span>No Category</span>
                  )}
                </div>
                  <div className="tags-container">
                      {schedule.tags && schedule.tags.length > 0 ? (
                      schedule.tags.map((tag, index) => (
                      <HashtagLink key={index} tag={tag} />
                       ))
                       ) : (
                      <span className="no-tags">No tags</span>
                       )}
                      </div>
                  <StarRating rating={schedule.averageRating || 0} totalStars={5} />
                
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default AllSchedules;
