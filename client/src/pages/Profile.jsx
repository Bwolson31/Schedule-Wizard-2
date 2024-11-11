import React, {useState} from 'react';
import { useQuery, useMutation } from '@apollo/client';  
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { GET_SCHEDULES } from '../graphql/queries';
import AuthService from '../auth/auth.js';
import AllSchedules from '../components/schedules/AllSchedules';
import { useProfileHandlers } from '../hooks/useProfileHandlers';
import EditModal from '../components/schedules/EditModal';  
import { UPDATE_SCHEDULE } from '../graphql/mutations'; 
import { useUser } from '../contexts/UserContext';

function Profile() {
  const { currentUser } = useUser(); 
  const userId = currentUser?.data?._id;  

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const { loading, error, data, refetch } = useQuery(GET_SCHEDULES, {
    variables: { userId, sortBy: 'DateCreated', sortOrder: 'NewestFirst' },
    fetchPolicy: 'network-only',
    skip: !userId, // Skip query if userId is not available
  });

  const [updateSchedule] = useMutation(UPDATE_SCHEDULE);

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
          category: updatedData.category || null,
          tags: updatedData.tags || [],
        },
      });
  
      console.log('Schedule updated successfully:', result);
      refetch(); // Refetch the schedules after update
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowEditModal(false);
    setEditTarget(null);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading schedules...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Error loading schedules: {error.message}</Alert>
      </Container>
    );
  }

  // Extract schedules from query data
  const schedules = data ? data.getSchedules : [];

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
                title="Your Schedules"
                isEditable={true}
                refetch={refetch}
                onEdit={handleEditClick}
                onDelete={handleDeleteSchedule}
              />
              {showEditModal && (
                <EditModal
                  show={showEditModal}
                  onHide={handleModalClose}
                  target={editTarget}
                  onSave={handleSave}
                  onDelete={handleDeleteSchedule}
                  onAddActivity={handleAddActivity}
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
