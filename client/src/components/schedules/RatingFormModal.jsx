import React, { useState, useQuery } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_RATING } from '../../graphql/mutations';
import { GET_ONE_SCHEDULE } from '../../graphql/queries';
import { useUser } from '../../contexts/UserContext';
import StarRating from './StarRating';  


const RatingFormModal = ({ scheduleId, refetch, show, close }) => {

    



    
  const [rating, setRating] = useState(0);
  const { currentUser } = useUser();

  const [addRating, { loading }] = useMutation(ADD_RATING, {
    
    
      variables: {
          scheduleId,
          rating
      },
      update: (cache, { data: { addRating } }) => {
        const existingSchedule = cache.readQuery({
          query: GET_ONE_SCHEDULE,
          variables: { scheduleId }
        });
  
        cache.writeQuery({
          query: GET_ONE_SCHEDULE,
          variables: { scheduleId },
          data: {
            getOneSchedule: {
              ...existingSchedule.getOneSchedule,
              ...addRating
            }
          }
        });
      },
      
      onCompleted: () => {
        console.log("Rating updated!");
  
        close();
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
    <Modal show={show} onHide={close} >
      <Modal.Header closeButton>
        <Modal.Title>Rate this Schedule:</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <StarRating rating={rating} setRating={setRating} />
      
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={close}>Close</Button>
            <Button variant="primary" onClick={handleSubmit}>Submit Rating</Button>
              </Modal.Footer>
      </Modal>
  );
};

export default RatingFormModal;
