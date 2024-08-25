import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_COMMENT } from '../../graphql/mutations';
import { Alert, Form, Button } from 'react-bootstrap';

function CommentForm({ scheduleId, onCommentAdded }) {
  const [comment, setComment] = useState('');
  const [addComment, { loading, error }] = useMutation(ADD_COMMENT, {
    variables: {
      scheduleId,
      comment
    },
    onCompleted: () => {
      onCommentAdded();
      setComment(''); // Reset comment field after submission
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() !== '') {
      addComment();
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="comment">
        <Form.Label>Write a comment:</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Enter your comment here..."
          disabled={loading}
        />
      </Form.Group>
      <Button variant="primary" type="submit" disabled={loading}>
        Submit Comment
      </Button>
      {error && <Alert variant="danger" className="mt-2">Error submitting comment: {error.message}</Alert>}
    </Form>
  );
}

export default CommentForm;
