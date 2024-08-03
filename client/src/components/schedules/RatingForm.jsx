import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_RATING, CHECK_USER_RATING } from '../../graphql/mutations';
import { GET_ONE_SCHEDULE } from '../../graphql/queries';
import { useUser } from '../../contexts/UserContext';
import './RatingForm.css';

const RatingForm = ({ scheduleId }) => {
  // State to hold the user's rating, if they are updating their rating, and messages to display to the user
  const [rating, setRating] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  // Get the current user from the UserContext
  const { currentUser } = useUser();

  // Query to get the details of the schedule being rated
  const { data, loading: queryLoading, error, refetch } = useQuery(GET_ONE_SCHEDULE, {
    variables: { scheduleId },
  });

  // Mutation to add or update the rating for the schedule
  const [addRating, { loading: mutationLoading }] = useMutation(ADD_RATING, {
    onCompleted: () => {
      refetch(); // Re-fetch schedule details to update UI
      if (isUpdating) {
        setMessage('Your rating has been updated successfully.');
      } else {
        setMessage('Your rating has been recorded successfully.');
      }
    }
  });

  // Query to check if the user has already rated this schedule
  const { data: userRatingData } = useQuery(CHECK_USER_RATING, {
    variables: { scheduleId },
    skip: !currentUser // Skip this query if there is no current user
  });

  // Effect to update the rating state if the user has already rated this schedule
  useEffect(() => {
    if (userRatingData && userRatingData.checkUserRating) {
      const userRating = userRatingData.checkUserRating;
      console.log('User rating found:', userRating);
      if (userRating) {
        setRating(userRating.rating);
        setIsUpdating(true);
      } else {
        setIsUpdating(false);
      }
    }
  }, [userRatingData]);

  // Handle form submission to add or update the rating
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addRating({
        variables: {
          scheduleId,
          rating
        }
      });
      console.log('Rating submitted successfully');
    } catch (err) {
      console.error('Error submitting rating:', err);
      setMessage('Failed to submit rating. Please try again.');
    }
  };

  // Handle closing the message alert
  const handleCloseMessage = () => {
    setMessage('');
  };

  // Display loading or error messages if necessary
  if (queryLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading schedule details: {error.message}</p>;

  return (
    <div>
      {/* Form for submitting a rating */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="rating">Rate this schedule (1-5):</label>
        <select
          name="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
          disabled={mutationLoading} // Disable the dropdown while the mutation is loading
        >
          <option value="">Select a rating</option>
          <option value="1">1 - Poor</option>
          <option value="2">2 - Fair</option>
          <option value="3">3 - Good</option>
          <option value="4">4 - Very Good</option>
          <option value="5">5 - Excellent</option>
        </select>
        <button type="submit" disabled={mutationLoading}>Submit Rating</button>
      </form>
      {message && (
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <p style={{ margin: '0', flexGrow: '1' }}>{message}</p>
          <button onClick={handleCloseMessage} style={{ marginLeft: '10px' }}>X</button>
        </div>
      )}
    </div>
  );
};

export default RatingForm;
