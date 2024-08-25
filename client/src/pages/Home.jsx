import React from 'react';
import AllSchedules from '../components/schedules/AllSchedules';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


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
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <AllSchedules />
        </Col>
      </Row>
    </Container>
  );
}

export default Home;

