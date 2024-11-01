import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ScheduleTitle from './ScheduleTitle';
import ScheduleCategory from './ScheduleCategory';
import ScheduleTags from './ScheduleTags';
import ScheduleActivity from './ScheduleActivity';
import ActivityModal from './ActivityModal';
import { useProfileHandlers } from '../../hooks/useProfileHandlers';

function EditModal({ show, onHide, target, onSave, onDelete, refetch }) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState([]);
    const [activities, setActivities] = useState([]);
    const [currentActivity, setCurrentActivity] = useState(null);
    const [showActivityModal, setShowActivityModal] = useState(false);

    const { handleAddActivity, handleUpdateActivity, handleDeleteActivity } = useProfileHandlers(refetch);

    useEffect(() => {
        if (target) {
            setTitle(target.title || '');
            setCategory(target.category || 'GENERAL');
            setTags(target.tags || []);
            setActivities(target.activities || []);
        }
    }, [target]);

    useEffect(() => {
        console.log("Activities updated:", activities);
    }, [activities]);


    const openActivityModal = (activity) => {
        setCurrentActivity(activity);  // Set the current activity for editing
        setShowActivityModal(true);
    };

    const closeActivityModal = () => {
        setShowActivityModal(false);
        setCurrentActivity(null);  // Reset current activity after closing modal
    };

    const handleActivitySave = (activityId, activityData) => {
        if (activityId) {
            handleUpdateActivity(activityId, activityData, () => {
                setActivities(prevActivities => 
                    prevActivities.map(a => (a._id === activityId ? { ...a, ...activityData } : a))
                );
                closeActivityModal();
            });
        } else {
            handleAddActivity(target._id, activityData, (newActivity) => {
                setActivities(prevActivities => [...prevActivities, newActivity]);
                closeActivityModal();
            });
        }
    };
    
      


    const handleScheduleSave = () => {
        // Assume onSave expects the schedule ID and the new schedule details
        onSave(target._id, { title, category, tags, activities });
        onHide();
    };

    return (
        <>
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Schedule</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ScheduleTitle title={title} onSave={setTitle} />
                    <ScheduleCategory category={category} onSave={setCategory} />
                    <ScheduleTags
                        tags={tags}
                        isEditable={true}
                        onSave={setTags}
                        onDeleteTag={(tagToRemove) => setTags(prevTags => prevTags.filter(tag => tag !== tagToRemove))}
                    />
                    <ScheduleActivity
                        activities={activities}
                        onAddActivity={() => openActivityModal(null)}  // For adding new activity
                        onUpdateActivity={openActivityModal}  // Pass the entire activity object for edits
                        onRemoveActivity={handleDeleteActivity}
                        isEditable={true}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Close</Button>
                    <Button variant="primary" onClick={handleScheduleSave}>Save Changes</Button>
                    <Button variant="danger" onClick={() => onDelete(target._id)}>Delete Schedule</Button>
                </Modal.Footer>
            </Modal>

            <ActivityModal
                show={showActivityModal}
                onHide={closeActivityModal}
                onSave={handleActivitySave}
                activity={currentActivity}
                scheduleId={target._id}
            />
        </>
    );
}

export default EditModal;