import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';

function EditActivityModal({ show, onHide, activity, onUpdateActivity }) {
    const [editedActivity, setEditedActivity] = useState(activity);

    useEffect(() => {
        setEditedActivity(activity); // Update local state when activity prop changes
    }, [activity]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedActivity(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onUpdateActivity(editedActivity._id, editedActivity);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Activity</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <FormGroup>
                        <FormLabel>Title</FormLabel>
                        <FormControl 
                            type="text" 
                            name="title" 
                            value={editedActivity.title} 
                            onChange={handleChange} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl 
                            type="time" 
                            name="startTime" 
                            value={editedActivity.startTime} 
                            onChange={handleChange} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>End Time</FormLabel>
                        <FormControl 
                            type="time" 
                            name="endTime" 
                            value={editedActivity.endTime} 
                            onChange={handleChange} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Day</FormLabel>
                        <FormControl 
                            as="select" 
                            name="day" 
                            value={editedActivity.day} 
                            onChange={handleChange}
                        >
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Description</FormLabel>
                        <FormControl 
                            as="textarea" 
                            rows={3} 
                            name="description" 
                            value={editedActivity.description} 
                            onChange={handleChange} 
                        />
                    </FormGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
                <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditActivityModal;
