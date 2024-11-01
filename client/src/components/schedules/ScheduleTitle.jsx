import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const ScheduleTitle = ({ title, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);

  const handleBlur = () => {
    onSave(updatedTitle);  // Call the parent function to save the updated title
    setIsEditing(false);   // Exit edit mode
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {isEditing ? (
        <Form.Control
          type="text"
          value={updatedTitle}
          onChange={(e) => setUpdatedTitle(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '4px',
            outline: 'none',
          }}
        />
      ) : (
        <h5
          onClick={() => setIsEditing(true)}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 'bold',
            fontSize: '1.25rem',
          }}
        >
          {title}
          <FontAwesomeIcon
            icon={faPencilAlt}
            style={{ cursor: 'pointer', color: 'green' }}
          />
        </h5>
      )}
    </div>
  );
};

export default ScheduleTitle;
