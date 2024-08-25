import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ONE_SCHEDULE } from '../../graphql/queries';
import { Container, Row, Col, Card } from 'react-bootstrap';
import RatingForm from './RatingForm';
import StarRating from './StarRating';

function ScheduleDetail() {
  const { scheduleId } = useParams();
  const { loading, error, data, refetch } = useQuery(GET_ONE_SCHEDULE, {
    variables: { scheduleId },
    fetchPolicy: "network-only"
  });

  // Log average rating whenever data changes
  useEffect(() => {
    console.log('Current average rating:', data?.getOneSchedule?.averageRating);
  }, [data]);

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
          <Card border="success">
            <Card.Body>
              <h2>
                {scheduleData.title} <StarRating rating={scheduleData.averageRating || 0} />
              </h2>
              <RatingForm scheduleId={scheduleId} refetch={refetch} />
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
