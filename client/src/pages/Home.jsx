import React from 'react';
import { useQuery } from '@apollo/client';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { GET_SCHEDULES } from '../graphql/queries';
import AllSchedules from '../components/schedules/AllSchedules';

function Home() {
  // Fetch data using useQuery
  const { loading, error, data, refetch } = useQuery(GET_SCHEDULES, {
    variables: { sortBy: 'DateCreated', sortOrder: 'NewestFirst' },
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
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

  // Pass the fetched data to AllSchedules
  const schedules = data ? data.getSchedules : [];

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title as="h1">Welcome to ScheduleWizard</Card.Title>
              <Card.Text>
                Manage and create your schedules with ease.
              </Card.Text>
            </Card.Body>
          </Card>
          <AllSchedules 
            title="All Schedules" 
            schedules={schedules} 
            refetch={refetch} 
            isEditable={false} 
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Home;

