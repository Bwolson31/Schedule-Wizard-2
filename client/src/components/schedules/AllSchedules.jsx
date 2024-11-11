import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SCHEDULES } from '../../graphql/queries';
import { Link } from 'react-router-dom';
import { ListGroup, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import StarRating from './StarRating';
import SortingComponent from './SortingComponent';
import CategoryLink from '../CategoryLink';
import HashtagLink from '../HashtagLink';
import './AllSchedules.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

function AllSchedules({ 
  schedules = [], 
  title, 
  isEditable = false, 
  onEdit,
  sortBy,
  sortOrder,
  refetch
}) {
  console.log('Schedules prop in AllSchedules:', schedules);
  const handleSortChange = (newSortBy, newSortOrder) => {
    console.log('handleSortChange triggered in AllSchedules:', newSortBy, newSortOrder);
    if (refetch) {
      refetch({ sortBy: newSortBy, sortOrder: newSortOrder })
        .then(result => {
          console.log('Refetch successful, new data:', result.data);
        })
        .catch(err => {
          console.error('Error during refetch:', err);
        });
    }
  };
  

  if (schedules.length === 0) {
    console.log('No schedules available - schedules is empty:', schedules);
    return (
      <Container className="my-5">
        <Alert variant="info">No schedules available</Alert>
      </Container>
    );
  }

  return (
    <Container className="container">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="my-4 text-center custom-title">{title}</h2>
          <SortingComponent sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
          <ListGroup>
            {schedules.map((schedule, index) => (
              
  

              <ListGroup.Item key={schedule._id} className="schedule-item border border-success text-center">
                <div className="d-flex justify-content-between align-items-center">
                  <Link to={`/schedule/${schedule._id}`} className="schedule-title">
                    {schedule.title || 'Untitled Schedule'}
                  </Link>
                  {isEditable && (
                    <FontAwesomeIcon
                      icon={faPencilAlt}
                      onClick={() => onEdit(schedule)}
                      className="edit-icon"
                      style={{ cursor: 'pointer', color: 'green' }}
                    />
                  )}
                </div>
                <CategoryLink category={schedule.category} />
                <div className="tags-container">
                  {schedule.tags.length > 0 ? schedule.tags.map((tag, index) => <HashtagLink key={index} tag={tag} />) : <span className="no-tags">No tags</span>}
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
