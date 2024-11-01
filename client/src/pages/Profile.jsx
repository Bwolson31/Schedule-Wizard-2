import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';  
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { ME } from '../graphql/queries';
import AuthService from '../auth/auth.js';
import AllSchedules from '../components/schedules/AllSchedules';
import { useProfileHandlers } from '../hooks/useProfileHandlers';
import EditModal from '../components/schedules/EditModal';  
import { UPDATE_SCHEDULE } from '../graphql/mutations'; 

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const [updateSchedule] = useMutation(UPDATE_SCHEDULE);

  useEffect(() => {
    if (AuthService.loggedIn()) {
      const profile = AuthService.getProfile();
      setUserProfile(profile);
    }
  }, []);

  const { loading, error, data, refetch } = useQuery(ME, {
    skip: !userProfile,  // Ensure userProfile is initialized
  });

  // Use hook to get handlers
  const { handleDeleteSchedule, handleAddActivity, handleDeleteActivity, handleUpdateActivity } = useProfileHandlers(refetch);

  // Function to handle when Edit is clicked and open modal
  const handleEditClick = (schedule) => {
    setEditTarget(schedule);  // Set the target schedule to be edited
    setShowEditModal(true);   // Show the modal
  };

  // Function to handle saving updated schedule from modal
  const handleSave = async (scheduleId, updatedData) => {
    try {
      console.log('Saving updated schedule with ID:', scheduleId);
      console.log('Updated data being sent:', updatedData);
      
      if (!updatedData.title) {
        throw new Error('Title is required.');
      }
  
      const result = await updateSchedule({
        variables: {
          scheduleId,
          title: updatedData.title,
          category: updatedData.category || null,  // Set category to null if not provided
          tags: updatedData.tags || [],            // Set tags to an empty array if not provided
        },
      });
  
      console.log('Schedule updated successfully:', result);
      refetch(); // Refetch the schedules after update
      setShowEditModal(false);  // Close the modal after saving
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };
  
  // Handle modal close
  const handleModalClose = () => {
    setShowEditModal(false);
    setEditTarget(null);  // Clear the edit target when modal closes
  };

  if (!userProfile) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        Please log in to view your profile.
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        Loading...
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Error: {error.message}</Alert>
      </Container>
    );
  }

// Extract schedules
const userData = data?.me || {};
const schedules = userData.schedules || [];

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col md={{ span: 8, offset: 2 }}>
          <h2 className="text-center mb-4 text-success">Your Schedules</h2>
          {schedules.length === 0 ? (
            <Alert variant="info">You have not created any schedules yet.</Alert>
          ) : (
            
            <>
            <AllSchedules
              schedules={schedules}
              isEditable={true}
              onDelete={handleDeleteSchedule}
              onEdit={handleEditClick}
              onUpdateActivity={(activityId, activityData) => handleUpdateActivity(
                activityId,
                activityData.title || 'Untitled Activity', // Fallback to a default if title is empty
                activityData.description,
                activityData.startTime,
                activityData.endTime
              )}
              onRemoveActivity={handleDeleteActivity}
              refetch={refetch}
            />

{showEditModal && (
  <EditModal
    show={showEditModal}
    onHide={handleModalClose}
    target={editTarget}
    onSave={handleSave}
    onDelete={handleDeleteSchedule}
    onAddActivity={handleAddActivity} // This comes from useProfileHandlers now
    onUpdateActivity={handleUpdateActivity}
    onRemoveActivity={handleDeleteActivity}    
  />
)}


            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
