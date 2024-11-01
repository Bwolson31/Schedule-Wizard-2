    
    import { useMutation } from '@apollo/client';
    import {
      DELETE_SCHEDULE,
      REMOVE_ACTIVITY,
      UPDATE_ACTIVITY,
      UPDATE_CATEGORY,
      UPDATE_TAGS,
      DELETE_TAGS,
      ADD_ACTIVITY
    } from '../graphql/mutations';
    import { convertTimeToISO } from '../utils/convertTimeToISO';
    
    export const useProfileHandlers = (refetch = () => {}) => {
    
    
      const [deleteSchedule] = useMutation(DELETE_SCHEDULE, {
        onCompleted: () => refetch?.(),
        onError: (error) => console.error('Error deleting schedule:', error),
      });
    
      const [removeActivity] = useMutation(REMOVE_ACTIVITY, {
        onCompleted: () => {
            console.log("Activity deleted successfully");
            refetch();  // Optionally refetch queries if necessary
        },
        onError: (error) => {
            console.error("Error removing activity:", error);
            console.log(error.networkError, error.graphQLErrors);
            alert("Failed to delete activity: " + error.message);
        }
    });
      
      
    
      const [updateActivity] = useMutation(UPDATE_ACTIVITY, {
        onCompleted: () => {
          console.log('Update successful');
          refetch();
        },
        onError: (error) => {
          console.error('Error updating activity:', error);
          console.error(error.message);
        },
      });

      const [updateCategory] = useMutation(UPDATE_CATEGORY, {
        onCompleted: () => refetch?.(),
        onError: (error) => console.error('Error updating category:', error),
      });
    
      const [updateTags] = useMutation(UPDATE_TAGS, {
        onCompleted: () => refetch?.(),
        onError: (error) => console.error('Error updating tags:', error),
      });
    
      const [deleteTags] = useMutation(DELETE_TAGS, {
        onCompleted: () => refetch?.(),
        onError: (error) => console.error('Error deleting tag:', error),
      });
    
      const [addActivity, { data, loading, error }] = useMutation(ADD_ACTIVITY, {
        onCompleted: (data) => {
          console.log("Activity added successfully:", data);
          refetch(); 
        },
        onError: (error) => {
          console.error("Error adding activity:", error);
        }
      });
      
      // Handler functions below...
    
      const handleAddActivity = async (scheduleId, activityData, callback) => {
        console.log("Attempting to add activity:", activityData);
      
        if (!scheduleId || !activityData) {
          console.error('Schedule ID or Activity data is missing');
          return;
        }
      
        // Check if all required fields are present
        if (!activityData.title || !activityData.startTime || !activityData.endTime || !activityData.day) {
          console.error('Invalid activity data provided:', activityData);
          return;
        }
      
        // Convert time fields to ISO strings
        activityData.startTime = convertTimeToISO(activityData.startTime);
        activityData.endTime = convertTimeToISO(activityData.endTime);
      
        // Perform the mutation
        try {
          const response = await addActivity({
            variables: { scheduleId, activityData }
          });
          const newActivity = response.data.addActivities;
          callback(newActivity);  // Assuming callback updates the state correctly
        } catch (error) {
          console.error("Error adding activity:", error);
        }
      };
      
    
    
    

    
    const handleUpdateActivity = async (activityId, activityData, callback) => {
      console.log('Attempting to update activity with ID:', activityId, 'Data:', activityData);
    
      if (!activityId || !activityData) {
        console.error('Activity ID or data is missing');
        return;
      }
    
      const { title, description, startTime, endTime, day } = activityData;
      if (!title || !description || !startTime || !endTime || !day) {
        console.error('Missing fields:', { title, description, startTime, endTime, day });
        return;
      }
    
      const variables = {
        activityId,
        title,
        description,
        startTime: convertTimeToISO(startTime),
        endTime: convertTimeToISO(endTime),
        day
      };
    
      try {
        await updateActivity({ variables });
        console.log('Activity update successful');
        if (callback) callback();
      } catch (error) {
        console.error('Error updating activity:', error);
      }
    };
    
    
  
  
  



      
    
    
    
    

  // Handler to delete a schedule
  const handleDeleteSchedule = async (scheduleId, userId) => {
    if (!scheduleId || !userId) {
      console.error('Schedule ID or User ID is missing');
      return;
    }
    await deleteSchedule({ variables: { scheduleId, userId } });
  };

  // Handler to remove an activity
  const handleDeleteActivity = async (activityId) => {
    if (!activityId) {
        console.error('Activity ID is missing');
        return;
    }

    // Pass `activityId` when invoking the mutation
    await removeActivity({
        variables: { activityId }
    });
};


  // Handler to update the category of a schedule
  const handleUpdateCategory = async (scheduleId, newCategory) => {
    if (!scheduleId) {
      console.error('Schedule ID is missing');
      return;
    }
    await updateCategory({ 
      variables: { 
        scheduleId, 
        category: newCategory 
      } 
    });
  };
  
  // Handler to update the tags of a schedule
  const handleUpdateTags = async (scheduleId, newTags) => {
    if (!scheduleId) {
      console.error('Schedule ID is missing');
      return;
    }
    await updateTags({ 
      variables: { 
        scheduleId, 
        tags: newTags 
      } 
    });
  };

  // Handler to delete a specific tag from a schedule
  const handleDeleteTag = async (scheduleId, tag) => {
    if (!scheduleId || !tag) {
      console.error('Schedule ID or tag is missing');
      return;
    }
    await deleteTags({ 
      variables: { 
        scheduleId, 
        tag 
      } 
    });
  };

  // Return all handlers
  return {
    handleDeleteSchedule,
    handleDeleteActivity,
    handleUpdateActivity,
    handleUpdateCategory,  
    handleUpdateTags,      
    handleDeleteTag,        // Add handler for deleting a specific tag
    handleAddActivity
  };
};
