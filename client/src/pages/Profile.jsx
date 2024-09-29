import './Profile.css';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Container, Row, Col, Card, ListGroup, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ME } from '../graphql/queries';
import { DELETE_SCHEDULE, REMOVE_ACTIVITY, UPDATE_ACTIVITY } from '../graphql/mutations';
import AddActivityButton from '../components/schedules/AddActivityButton';
import UpdateActivityButton from '../components/schedules/UpdateActivityButton';
import RemoveActivityButton from '../components/schedules/RemoveActivityButton';
import AuthService from '../auth/auth.js';
import StarRating from '../components/schedules/StarRating.jsx';
import SortingComponent from '../components/schedules/SortingComponent';
import HashtagLink from '../components/HashtagLink.jsx';

function Profile() {
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        if (AuthService.loggedIn()) {
            const profile = AuthService.getProfile();
            setUserProfile(profile);
            console.log("Profile retrieved in Profile component:", profile);
        } else {
            console.log("User is not logged in.");
        }
    }, []);

    const [sortBy, setSortBy] = useState('DateCreated');
    const [sortOrder, setSortOrder] = useState('NewestFirst');

    const { loading, error, data, refetch } = useQuery(ME, {
        variables: { sortBy, sortOrder },
        skip: !userProfile, 
    });

    const [deleteSchedule] = useMutation(DELETE_SCHEDULE, {
        onCompleted: () => refetch(),
        onError: (error) => console.error('Error deleting schedule:', error)
    });

    const [removeActivity] = useMutation(REMOVE_ACTIVITY, {
        onCompleted: () => refetch(),
        onError: (error) => console.error('Error removing activity:', error)
    });

    const [updateActivity] = useMutation(UPDATE_ACTIVITY, {
        onCompleted: () => refetch(),
        onError: (error) => console.error('Error updating activity:', error)
    });

    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    if (!userProfile) {
        return <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>Please log in to view your profile.</Container>;
    }

    if (loading) return <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>Loading...</Container>;
    if (error) return <Container className="mt-5"><Alert variant="danger">Error: {error.message}</Alert></Container>;

    const userData = data?.me || {};
    const schedules = userData.schedules || [];

    const handleDeleteSchedule = async (scheduleId) => {
        await deleteSchedule({ variables: { scheduleId, userId: userData._id } });
    };

    const handleDeleteActivity = async (activityId) => {
        await removeActivity({ variables: { activityId } });
    };

    const handleUpdateActivity = async (activityId, title, description) => {
        await updateActivity({ variables: { activityId, title, description } });
    };

    return (
        <Container className="mt-5">
            {showNotification && (
                <Alert variant="success" className="fixed-alert" onClose={() => setShowNotification(false)} dismissible>
                    {notificationMessage}
                </Alert>
            )}
            <Row className="mb-4">
                <Col md={{ span: 8, offset: 2 }}>
                    <h2 className="text-center mb-4 text-success">Your Profile</h2>
                    <Card>
                        <Card.Body>
                            <Card.Title>{userData.username}</Card.Title>
                            <Card.Text>Email: {userData.email}</Card.Text>
                            <Button as={Link} to="/rated-schedules" variant="info">View Rated Schedules</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 8, offset: 2 }}>
                    <h2 className="text-center mb-4 text-success">Your Schedules</h2>
                    <SortingComponent sortBy={sortBy} setSortBy={setSortBy} sortOrder={sortOrder} setSortOrder={setSortOrder} />
                    {schedules.length === 0 ? (
                        <Alert variant="info">No schedules available</Alert>
                    ) : (
                        schedules.map(schedule => (
                            <Card key={schedule._id} className="mb-3">
                                <Card.Header as="h5" className="bg-success text-white d-flex justify-content-between align-items-center">
                                    <Link to={`/schedule/${schedule._id}`} className="text-white">
                                        {schedule.title}
                                        <StarRating rating={Math.round(schedule.averageRating || 0)} />
                                    </Link>
                                    <div>
                                        {/* Ensure tags are visible */}
                                        <div className="tags-container">
                                            {schedule.tags && schedule.tags.length > 0 ? (
                                                schedule.tags.map((tag, index) => (
                                                    <HashtagLink key={index} tag={tag} />
                                                ))
                                            ) : (
                                                <span className="no-tags">No tags</span>
                                            )}
                                        </div>
                                        <Button variant="info" onClick={() => { document.location.replace(`/update/${schedule._id}`) }}>Update</Button>
                                        <Button variant="danger" onClick={() => handleDeleteSchedule(schedule._id)}>Delete</Button>
                                    </div>
                                </Card.Header>
                                <ListGroup variant="flush">
                                    {schedule.activities.map(activity => (
                                        <ListGroup.Item key={activity._id} className="d-flex justify-content-between align-items-center">
                                            {activity.title}
                                            <div>
                                                <UpdateActivityButton activity={activity} onActivityUpdate={handleUpdateActivity} />
                                                <RemoveActivityButton activityId={activity._id} onActivityDelete={handleDeleteActivity} />
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                                <Card.Footer>
                                    <AddActivityButton scheduleId={schedule._id} />
                                </Card.Footer>
                            </Card>
                        ))
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;


