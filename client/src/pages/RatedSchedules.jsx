import React from 'react';
import { useQuery } from '@apollo/client';
import { Container, Alert, Spinner } from 'react-bootstrap';
import { GET_RATED_SCHEDULES } from '../graphql/queries';
import AllSchedules from '../components/schedules/AllSchedules';
import { useUser } from '../contexts/UserContext';

function RatedSchedules() {
  const { currentUser } = useUser();
  const userId = currentUser?.data?._id;

  const { loading, error, data, refetch } = useQuery(GET_RATED_SCHEDULES, {
    variables: { userId, sortBy: 'DateCreated', sortOrder: 'NewestFirst' },
    fetchPolicy: 'network-only',
    skip: !userId,
  });
  
  

  React.useEffect(() => {
    console.log('Fetched data in RatedSchedules:', data);
  }, [data]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading rated schedules...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">Error loading rated schedules: {error.message}</Alert>
      </Container>
    );
  }

  // Use the simpler version if it works consistently
  const ratedSchedules = data?.getRatedSchedules || [];

  console.log('Updated ratedSchedules:', ratedSchedules);

  return (
    <Container>
      <AllSchedules
        title="Rated Schedules"
        schedules={ratedSchedules}
        refetch={refetch}
        isEditable={false}
      />
    </Container>
  );
}

export default RatedSchedules;
