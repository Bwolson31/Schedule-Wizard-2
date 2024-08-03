import React, { useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { UPDATE_ACTIVITY } from '../../graphql/mutations';
import { formatTimeForInput } from '../../utils/formatTimeForInput';  

const UpdateActivityButton = ({ activity }) => {
  if (!activity) {
    console.error('UpdateActivityButton: No activity provided');
    return <Button variant="warning" disabled>Edit</Button>;
  }

  const [show, setShow] = useState(false);
  const [title, setTitle] = useState(activity.title);
  const [description, setDescription] = useState(activity.description);
  const [startTime, setStartTime] = useState(formatTimeForInput(activity.startTime));
  const [endTime, setEndTime] = useState(formatTimeForInput(activity.endTime));
  const [errorMessage, setErrorMessage] = useState('');

  const [updateActivity, { loading, error }] = useMutation(UPDATE_ACTIVITY);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleSave = async () => {
    try {
      const formattedStartTime = new Date(`1970-01-01T${startTime}:00`).toISOString();
      const formattedEndTime = new Date(`1970-01-01T${endTime}:00`).toISOString();

      console.log('Updating activity with variables:', {
        activityId: activity._id,
        title,
        description,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        day: activity.day
      });

      await updateActivity({
        variables: {
          activityId: activity._id,
          title,
          description,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          day: activity.day
        }
      });

      setShow(false); // Close the modal on success
    } catch (error) {
      console.error('Error updating activity:', error);
      setErrorMessage(error.message || 'Failed to update activity');
    }
  };

  return (
    <>
      <Button variant="warning" onClick={handleShow}>Edit</Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Activity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
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
          </Form>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleSave} disabled={loading}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateActivityButton;


