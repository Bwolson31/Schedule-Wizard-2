import React from 'react';
import { Card } from 'react-bootstrap';
import { formatTimeForInput } from '../../utils/formatTimeForInput';

function UserComment({ comment }) {
  const formattedTime = formatTimeForInput(comment.createdAt);
  
  return (
    <Card className="mb-2">
      <Card.Header>
        {comment.user.username} on {formattedTime}
      </Card.Header>
      <Card.Body>
        <Card.Text>
          {comment.comment}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default UserComment;
