import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ONE_SCHEDULE } from '../../graphql/queries';
import { Container, Row, Col, Card } from 'react-bootstrap';
import RatingForm from './RatingForm';  // Make sure this path is correct

function ScheduleDetail() {
  const { scheduleId } = useParams();
  const { loading, error, data } = useQuery(GET_ONE_SCHEDULE, {
    variables: { scheduleId }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading schedule details: {error.message}</div>;
  if (!data || !data.getOneSchedule) return <div>No schedule found.</div>;

  const scheduleData = data.getOneSchedule;
  const activities = scheduleData.activities || [];

  const formatTime = (timestamp) => {
    if (!timestamp) {
      return 'Time not set';
    }
    const date = new Date(Number(timestamp));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <Container>
      <Row className="mt-5">
        <Col>
          <Card border="success" style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <Card.Header className="text-center" style={{ backgroundColor: 'transparent', border: 'none' }}>
              <h1 style={{ color: 'green' }}>Schedule Details</h1>
            </Card.Header>
            <Card.Body>
              <h2 className="text-center mb-4" style={{ color: 'green' }}>{scheduleData.title}</h2>
              {/* Place RatingForm here */}
              <RatingForm scheduleId={scheduleId} />
              <ul className="list-unstyled">
                {activities.map(activity => (
                  <li key={activity._id} className="mb-3">
                    <h4 className="mb-1" style={{ color: 'green' }}>{activity.title}</h4>
                    <p className="mb-0"><strong>Day:</strong> {activity.day}</p>
                    <p className="mb-0"><strong>Time:</strong> {formatTime(activity.startTime)} - {formatTime(activity.endTime)}</p>
                    <p className="mb-0"><strong>Description:</strong> {activity.description}</p>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ScheduleDetail;
