import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_RATING } from '../../graphql/mutations';
import { GET_ONE_SCHEDULE } from '../../graphql/queries';
import { useUser } from '../../contexts/UserContext';
import StarRating from './StarRating';  
import { useApolloClient } from '@apollo/client';

const RatingForm = ({ scheduleId, refetch }) => {
  const client = useApolloClient();
  const [rating, setRating] = useState(0);
  const { currentUser } = useUser();

  const [addRating, { loading }] = useMutation(ADD_RATING, {
      variables: {
          scheduleId,
          rating
      },
      update: (cache, { data }) => {
        const { addRating: updatedSchedule } = data;
        cache.writeQuery({
            query: GET_ONE_SCHEDULE, 
        variables: { scheduleId },
        data: { getOneSchedule: updatedSchedule },
        });
      },
      onCompleted: () => {
        console.log("Rating updated!");
        // Optionally call refetch here if still needed
        refetch();
    },
    onError: (error) => {
        console.error("Error updating rating:", error);
    }
});

  const handleSubmit = () => {
    if (currentUser) {  // Ensure there is a logged-in user
        addRating();
    } else {
        console.error("You must be logged in to rate.");
    }
};

  return (
      <div>
          <h3>Rate this schedule:</h3>
          <StarRating rating={rating} setRating={setRating} />
          <button onClick={handleSubmit} disabled={loading}>Submit Rating</button>
      </div>
  );
};

export default RatingForm;
