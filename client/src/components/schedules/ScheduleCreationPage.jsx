import React from 'react';
import AddScheduleForm from './AddScheduleForm';
import { useQuery } from '@apollo/client';
import { ME } from '../../graphql/queries';

const ScheduleCreationPage = () => {
  const { data, loading, error } = useQuery(ME);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Ensure data is loaded and user is available
  if (!data || !data.me) {
    return <p>No user data available</p>;
  }

  return (
    <div>
      <h1>Create Schedule</h1>
      <AddScheduleForm user={data.me} />
    </div>
  );
};

export default ScheduleCreationPage;
