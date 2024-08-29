import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 
import { formatTimeForInput } from '../../utils/formatTimeForInput';


function UserComment({ comment }) {
  const formattedTime = formatTimeForInput(comment.createdAt);
  
  return (
    <Card className="mb-2">
      <Card.Header>
      <Link to={`/user/${comment.user._id}`} style={{ textDecoration: 'none' }}>
          {comment.user.username}
        </Link> on {formattedTime}
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
