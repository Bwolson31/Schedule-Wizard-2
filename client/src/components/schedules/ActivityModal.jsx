import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { formatTimeForInput } from '../../utils/formatTimeForInput';

function ActivityModal({ show, onHide, onSave, activity = null, scheduleId }) {
    const [activityData, setActivityData] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        day: ''
    });

    useEffect(() => {
        if (activity) {
            setActivityData({
                title: activity.title || '',
                description: activity.description || '',
                startTime: formatTimeForInput(activity.startTime),  // Use formatted time
                endTime: formatTimeForInput(activity.endTime),
                day: activity.day || ''
            });
        } else {
            setActivityData({ title: '', description: '', startTime: '', endTime: '', day: '' });
        }
    }, [activity]);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setActivityData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        if (!activityData.title || !activityData.startTime || !activityData.endTime || !activityData.day) {
            alert("Please fill all fields.");
            return;
        }
        if (activity) {
            onSave(activity._id, activityData);
        } else {
            onSave(null, activityData);  // Pass null as the ID for new activities
        }
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{activity ? 'Edit Activity' : 'Add New Activity'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <FormLabel>Title</FormLabel>
                        <FormControl
                            type="text"
                            name="title"
                            value={activityData.title}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl
                            type="time"
                            name="startTime"
                            value={activityData.startTime}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>End Time</FormLabel>
                        <FormControl
                            type="time"
                            name="endTime"
                            value={activityData.endTime}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Day</FormLabel>
                        <FormControl
                            as="select"
                            name="day"
                            value={activityData.day}
                            onChange={handleChange}
                        >
                            <option value="">Select a day</option>
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
                            value={activityData.description}
                            onChange={handleChange}
                        />
                    </FormGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
                <Button variant="primary" onClick={handleSubmit}>
                    {activity ? 'Update Activity' : 'Add Activity'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ActivityModal;
