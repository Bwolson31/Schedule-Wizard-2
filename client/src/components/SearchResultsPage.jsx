import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HashtagLink from './HashtagLink';
import CategoryLink from './CategoryLink';

function SearchResultsPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get('category') || null;
  const searchTerm = params.get('searchTerm') || '';

  // Pull the schedules and users from the location state
  const { schedules = [], users = [] } = location.state || {};

  return (
    <Container>
      <h1 className="text-center mb-5" style={{ color: 'green' }}>
        {category ? `Search Results for Category "${category}"` : `Search Results for "${searchTerm}"`}
      </h1>
      <Row>
        <Col>
          <h2 className="mb-3" style={{ color: 'green' }}>Users</h2>
          {users.length === 0 ? (
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
          {schedules.length === 0 ? (
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
                  <CategoryLink category={schedule.category} />
                  <div>
                    {schedule.tags.map((tag, index) => (
                      <HashtagLink key={index} tag={tag} />
                    ))}
                  </div>
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
