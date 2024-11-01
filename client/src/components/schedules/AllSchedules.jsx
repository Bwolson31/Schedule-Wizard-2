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
  category = 'ALL', 
  isEditable = false, 
  onDelete, 
  onEdit,
}) {


  // State for sorting
  const [sortBy, setSortBy] = useState('DateCreated');
  const [sortOrder, setSortOrder] = useState('NewestFirst');



  // Fetch schedules with useQuery
  const { loading, error, data, refetch } = useQuery(GET_SCHEDULES, {
    variables: { category, query: '', tags: [], sortBy, sortOrder },
    fetchPolicy: 'network-only',
    onCompleted: (data) => console.log("Query completed", data),
    onError: (error) => console.log("Query error", error)
});

  useEffect(() => {
    refetch({ category, query: '', tags: [], sortBy, sortOrder });
}, [sortBy, sortOrder, refetch, category]);

  // Decide what schedules to show
  const schedulesToShow = schedules.length > 0 ? schedules : (data ? data.getSchedules : []);

  // Handle sorting changes
  const handleSortChange = (newSortBy, newSortOrder) => {

    setSortBy(newSortBy);
    setSortOrder(newSortOrder);

    // Refetch schedules with updated sort options
    if (typeof refetch === 'function') {
      refetch({
        category,
        query: '',
        tags: [],
        sortBy: newSortBy,
        sortOrder: newSortOrder
      });
      console.log("Refetch triggered with new sort options");
    } else {
      console.error("refetch is not a function, sort change was not applied");
    }
  };


  useEffect(() => {
    if (sortBy && sortOrder) {
      refetch({ category, query: '', tags: [], sortBy, sortOrder });
    }
  }, [sortBy, sortOrder, refetch, category]);

  

  // Check loading and error states
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

  if (schedulesToShow.length === 0) {
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
          <SortingComponent 
            sortBy={sortBy} 
            sortOrder={sortOrder} 
            onSortChange={handleSortChange} 
          />

          <ListGroup>
            {schedulesToShow.map(schedule => (
              <ListGroup.Item key={schedule._id} className="schedule-item border border-success text-center">
                <div className="d-flex justify-content-between align-items-center">
                  <Link to={`/schedule/${schedule._id}`} className="schedule-title">
                    {schedule.title}
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
                  {schedule.tags.length > 0 
                    ? schedule.tags.map((tag, index) => <HashtagLink key={index} tag={tag} />)
                    : <span className="no-tags">No tags</span>}
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
