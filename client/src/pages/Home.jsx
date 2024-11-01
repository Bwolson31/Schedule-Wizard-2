import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import AllSchedules from '../components/schedules/AllSchedules';

function Home() {
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
          <AllSchedules title="All Schedules" />
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
