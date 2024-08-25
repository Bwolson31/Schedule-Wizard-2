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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ScheduleDetail;
