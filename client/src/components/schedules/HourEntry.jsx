import React, { useState } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';

function HourEntry({ startHour, endHour, activity, updateActivity }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempActivity, setTempActivity] = useState(activity);

    const toggleEdit = () => {
        if (isEditing && tempActivity !== activity) {
            updateActivity(startHour, endHour, tempActivity);  // Update activity with start and end times
        }
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        setTempActivity(e.target.value);
    };

    return (
        <InputGroup className="mb-3">
            <InputGroup.Text>{`${startHour}:00 - ${endHour}:00`}</InputGroup.Text>
            {isEditing ? (
                <>
                    <FormControl
                        type="text"
                        value={tempActivity}
                        onChange={handleChange}
                    />
                    <Button variant="success" onClick={toggleEdit}>Save</Button>
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>  // Add Cancel button
                </>
            ) : (
                <>
                    <FormControl
                        type="text"
                        readOnly
                        value={activity}
                    />
                    <Button variant="outline-primary" onClick={toggleEdit}>Edit</Button>
                </>
            )}
        </InputGroup>
    );
}

export default HourEntry;
