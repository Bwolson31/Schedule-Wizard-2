import React, { useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_ACTIVITY } from '../../graphql/mutations';

const AddActivityButton = ({ scheduleId }) => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [day, setDay] = useState(''); // Add state for day
  const [errorMessage, setErrorMessage] = useState('');

  const [addActivity, { loading, error }] = useMutation(ADD_ACTIVITY, {
    onCompleted: () => {
      setShow(false);
      setTitle('');
      setDescription('');
      setStartTime('');
      setEndTime('');
      setDay(''); // Reset day
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleSave = async () => {
    try {
      const formattedStartTime = new Date(`1970-01-01T${startTime}:00`).toISOString();
      const formattedEndTime = new Date(`1970-01-01T${endTime}:00`).toISOString();

      await addActivity({
        variables: {
          scheduleId,
          activityData: {
            title,
            description,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            day, // Include day in variables
          },
        },
      });
    } catch (error) {
      console.error('Error adding activity:', error);
      setErrorMessage(error.message || 'Failed to add activity');
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add Activity
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Activity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter activity title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter activity description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Day</Form.Label>
              <Form.Control
                as="select"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              >
                <option value="" disabled>Select day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </Form.Control>
            </Form.Group>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={loading}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddActivityButton;
