import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ONE_SCHEDULE } from '../../graphql/queries';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import StarRating from './StarRating';
import CommentForm from './CommentForm';
import UserComment from './UserComment';
import CategoryLink from '../CategoryLink'; 
import HashtagLink from '../HashtagLink';   
import RatingFormModal from './RatingFormModal';

function ScheduleDetail () {
  const { scheduleId } = useParams();
  const { loading, error, data, refetch } = useQuery(GET_ONE_SCHEDULE, {
    variables: { scheduleId },
    fetchPolicy: "network-only"
  });

  const [show, setShow] = useState(false);


  useEffect(() => {
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading schedule details: {error.message}</div>;
  if (!data || !data.getOneSchedule) return <div>No schedule found.</div>;

  const scheduleData = data.getOneSchedule;
  const activities = scheduleData.activities || [];
  const comments = scheduleData.comments || [];  // Default to an empty array if comments are undefined

  const formatTime = (timestamp) => {
    if (!timestamp) {
      return 'Time not set';
    }
    const date = new Date(Number(timestamp));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleCommentAdded = () => {
    console.log("Comment was added!");
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
             <CategoryLink category={scheduleData.category} />
              {scheduleData.tags && scheduleData.tags.length > 0 && (
                <div>
                  <ul className="list-inline">
                    {scheduleData.tags.map((tag) => (
                      <li key={tag} className="list-inline-item">
                        <HashtagLink tag={tag} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            <>
              <Button variant="primary" onClick={() => setShow(true)}>Rate This Schedule</Button>
              <RatingFormModal scheduleId={scheduleId} show={show} close={() => setShow(false)}  />
              </>
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
              {comments.length > 0 && (
                <div>
                  <h4>Comments:</h4>
                  {comments.map((comment) => (
                    <UserComment key={comment._id} comment={comment} />
                  ))}
                </div>
              )}
              <CommentForm scheduleId={scheduleId} onCommentAdded={handleCommentAdded} refetch={refetch} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ScheduleDetail;
