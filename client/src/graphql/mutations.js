import { gql } from '@apollo/client';

//mutation to login a user
//Below is tested and working.
export const LOGIN_USER = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      email
      username
    }
  }
}
`;

//mutation for signing up a new user
//Below is tested and working.
export const ADD_USER = gql`
mutation AddUser($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    token
    user {
      _id
      email
      username
    }
  }
}
`;

// Mutation to add a new schedule

export const ADD_SCHEDULE = gql`
mutation AddSchedule($title: String!, $activities: [ActivityInput]) {
  addSchedule(title: $title, activities: $activities) {
    _id
    title
    activities {
      _id
      title
      description
      startTime
      endTime
      day
    }
  }
}
`;


// Mutation to update an existing schedule

export const UPDATE_SCHEDULE = gql`
mutation updateSchedule($scheduleId: ID!, $title: String!) {
  updateSchedule(scheduleId: $scheduleId, title: $title) {
    _id
    title
    activities {
      _id
      title
      startTime
      endTime
      description
      day
    }
  }
}
`;

// Mutation to delete a schedule
//Below is tested and works. Note, it also excludes 'activities' for now
export const DELETE_SCHEDULE = gql`
  mutation DeleteSchedule($scheduleId: ID!) {
    deleteSchedule(scheduleId: $scheduleId) {
      _id
      title
      activities {
        _id
        title
      }
    }
  }
`;


//Tested and working
export const ADD_ACTIVITY = gql`
mutation AddActivity($scheduleId: ID!, $activityData: ActivityInput!) {
  addActivity(scheduleId: $scheduleId, activityData: $activityData) {
    _id
    title
    activities {
      _id
      title
      startTime
      endTime
      description
      day
    }
  }
}
`;
//Tested and working
export const REMOVE_ACTIVITY = gql`
mutation RemoveActivity($activityId: ID!) {
  removeActivity(activityId: $activityId) {
    _id
    title
    activities {
      _id
      title
      startTime
      endTime
      description
      day
    }
  }
}
`;


export const UPDATE_ACTIVITY = gql`
mutation UpdateActivity($activityId: ID!, $title: String, $description: String, $startTime: String, $endTime: String, $day: String) {
  updateActivity(activityId: $activityId, title: $title, description: $description, startTime: $startTime, endTime: $endTime, day: $day) {
    _id
    title
    startTime
    endTime
    description
    day
  }
}`

export const ADD_RATING = gql`
  mutation AddRating($scheduleId: ID!, $rating: Int!) {
    addRating(scheduleId: $scheduleId, rating: $rating) {
      _id
      title
      ratings {
        user {
          _id
          username
        }
        rating
        createdAt
      }
    }
  }
`;

// Mutation to add a comment to a schedule
export const ADD_COMMENT = gql`
  mutation AddComment($scheduleId: ID!, $comment: String!) {
    addComment(scheduleId: $scheduleId, comment: $comment) {
      _id
      title
      comments {
        user {
          _id
          username
        }
        comment
        createdAt
      }
    }
  }
`;

// Query to check user rating
export const CHECK_USER_RATING = gql`
  query CheckUserRating($scheduleId: ID!) {
    checkUserRating(scheduleId: $scheduleId) {
      _id
      rating
      createdAt
      user {
        _id
        username
      }
    }
  }
`;
