import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const ScheduleActivity = ({ activities, onAddActivity, onUpdateActivity, onRemoveActivity, isEditable }) => (
  <ListGroup variant="flush">
    {activities.length === 0 ? (
      <ListGroup.Item className="d-flex justify-content-between align-items-center">
        <span>No activities added yet.</span>
      </ListGroup.Item>
    ) : (
      activities.filter(activity => activity && activity._id).map((activity) => (
        <ListGroup.Item
          key={activity._id}  
          className="d-flex justify-content-between align-items-center"
        >
          <span>{activity.title}</span> 
          {isEditable && (
            <div>
              <FontAwesomeIcon
                icon={faPencilAlt}
                onClick={() => onUpdateActivity(activity._id, {
                  title: activity.title,
                  description: activity.description,
                  startTime: activity.startTime,
                  endTime: activity.endTime,
                  day: activity.day
                })}
                style={{ cursor: 'pointer', color: 'green', marginRight: '10px' }}
              />
              <FontAwesomeIcon
                icon={faTrashAlt}
                onClick={() => onRemoveActivity(activity._id)}
                style={{ cursor: 'pointer', color: 'red' }}
              />
            </div>
          )}
        </ListGroup.Item>
      ))
    )}
    {isEditable && (
      <ListGroup.Item className="text-center">
        <FontAwesomeIcon
          icon={faPlusCircle}
          onClick={onAddActivity}
          style={{ cursor: 'pointer', color: 'green', fontSize: '1.5rem' }}
        />
      </ListGroup.Item>
    )}
  </ListGroup>
);

export default ScheduleActivity;
