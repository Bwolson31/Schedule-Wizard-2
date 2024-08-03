import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_SCHEDULE } from '../../graphql/mutations';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function AddScheduleForm({ user }) {
  const [title, setTitle] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [activities, setActivities] = useState(
    Array.from({ length: 7 }, () =>
      Array(17).fill(null).map(() => ({
        title: '',
        startTime: '',
        endTime: '',
        description: '',
        day: '' // Add day field to each activity
      }))
    )
  );
  const [addSchedule] = useMutation(ADD_SCHEDULE);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitting with activities:", activities);
    const formattedActivities = activities.flat().filter(activity => activity.title && activity.startTime && activity.endTime).map(activity => ({
      ...activity,
      startTime: parseTime(activity.startTime),
      endTime: parseTime(activity.endTime)
    }));
    console.log("Formatted activities for submission:", formattedActivities);

    try {
      const { data } = await addSchedule({
        variables: {
          title,
          activities: formattedActivities,
        },
      });
      document.location.replace('/');


      // Reset activities
      setTitle('');
      setActivities(Array.from({ length: 7 }, () => Array(17).fill({ title: '', startTime: '', endTime: '', description: '', day: '' })));
    } catch (error) {
      console.error('Error creating schedule:', error);
      if (error.graphQLErrors) {
        console.error('GraphQL Errors:', JSON.stringify(error.graphQLErrors, null, 2));
      }
      if (error.networkError) {
        console.error('Network Error:', JSON.stringify(error.networkError, null, 2));
      }
      alert('Failed to create schedule');
    }
  };

  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0); // This sets the time according to local timezone
  
    console.log("Time input string:", timeString);
    console.log("Local time set:", date);
    console.log("UTC time to be sent:", date.toISOString());
  
    return date.toISOString(); // sending the time in UTC
  };

  const handleActivityChange = (dayIndex, hourIndex, field, value) => {
    const updatedActivities = activities.map((day, idx) =>
      idx === dayIndex
        ? day.map((activity, hIdx) =>
            hIdx === hourIndex ? { ...activity, [field]: value, day: daysOfWeek[dayIndex] } : activity
          )
        : day
    );
  
    setActivities(updatedActivities);
  };

  return (
    <Container fluid>
      <Form onSubmit={handleSubmit} className="p-4">
        <Form.Group className="mb-3">
          <Form.Label className="h4" style={{ color: 'green' }}>Schedule Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter schedule title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ fontSize: '14px' }}
          />
        </Form.Group>
        <div className="d-flex flex-wrap justify-content-center mb-2">
          {daysOfWeek.map((day, dayIndex) => (
            <div key={dayIndex} className="p-1">
              <Button
                variant={selectedDay === dayIndex ? 'success' : 'secondary'}
                onClick={() => setSelectedDay(dayIndex)}
                className="animated-button"
                style={{ minWidth: '150px', padding: '10px' }}
              >
                {day}
              </Button>
            </div>
          ))}
        </div>
        {selectedDay !== null && (
          <Row>
            <Col>
              <div className="mt-2">
                {activities[selectedDay].map((activity, hourIndex) => (
                  <Row key={hourIndex} className="mb-2">
                    <Col xs={3}>
                      <Form.Control
                        type="text"
                        placeholder="Activity Title"
                        value={activity.title}
                        onChange={(e) => handleActivityChange(selectedDay, hourIndex, 'title', e.target.value)}
                        style={{ fontSize: '12px' }}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Control
                        type="time"
                        value={activity.startTime}
                        onChange={(e) => handleActivityChange(selectedDay, hourIndex, 'startTime', e.target.value)}
                        style={{ fontSize: '12px' }}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Control
                        type="time"
                        value={activity.endTime}
                        onChange={(e) => handleActivityChange(selectedDay, hourIndex, 'endTime', e.target.value)}
                        style={{ fontSize: '12px' }}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Control
                        type="text"
                        placeholder="Description"
                        value={activity.description}
                        onChange={(e) => handleActivityChange(selectedDay, hourIndex, 'description', e.target.value)}
                        style={{ fontSize: '12px' }}
                      />
                    </Col>
                  </Row>
                ))}
              </div>
            </Col>
          </Row>
        )}
        <div className="text-center mt-3">
          <Button type="submit" variant="success" className="animated-button" style={{ padding: '10px 20px' }}>Create Schedule</Button>
        </div>
      </Form>
    </Container>
  );
}

export default AddScheduleForm;
