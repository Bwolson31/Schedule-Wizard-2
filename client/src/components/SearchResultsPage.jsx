import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { FETCH_SCHEDULES_BY_CATEGORY, SEARCH_SCHEDULES } from '../graphql/queries';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HashtagLink from './HashtagLink';
import CategoryLink from './CategoryLink';

function SearchResultsPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get('category') || null;
  const searchTerm = params.get('searchTerm') || '';

  const [schedules, setSchedules] = useState([]);

  const [fetchSchedulesByCategory] = useLazyQuery(FETCH_SCHEDULES_BY_CATEGORY, {
    onCompleted: (data) => {
      setSchedules(data.fetchSchedulesByCategory || []);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const [searchSchedules] = useLazyQuery(SEARCH_SCHEDULES, {
    onCompleted: (data) => {
      setSchedules(data.searchSchedules || []);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (category) {
      // Fetch schedules by category if category is provided
      fetchSchedulesByCategory({ variables: { category } });
    } else if (searchTerm) {
      // Otherwise, search schedules by searchTerm
      console.log('Searching for schedules with term:', searchTerm);
      searchSchedules({ variables: { query: searchTerm, category: null, tags: [] } });
    }
  }, [category, searchTerm, fetchSchedulesByCategory, searchSchedules]);

  return (
    <Container>
      <h1 className="text-center mb-5" style={{ color: 'green' }}>
        {category ? `Search Results for Category "${category}"` : `Search Results for "${searchTerm}"`}
      </h1>
      <Row>
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

