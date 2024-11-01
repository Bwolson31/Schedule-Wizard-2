import { gql } from '@apollo/client';


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


export const ADD_SCHEDULE = gql`
mutation AddSchedule($title: String!, $activities: [ActivityInput], $category: Category!, $tags: [String]) {
  addSchedule(title: $title, activities: $activities, category: $category, tags: $tags) {
    _id
    title
    category
    tags
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


export const UPDATE_SCHEDULE = gql`
  mutation updateSchedule($scheduleId: ID!, $title: String!, $category: Category, $tags: [String]) {
    updateSchedule(scheduleId: $scheduleId, title: $title, category: $category, tags: $tags) {
      _id
      title
      category
      tags
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
}
`;


export const ADD_RATING = gql`
  mutation AddRating($scheduleId: ID!, $rating: Int!) {
    addRating(scheduleId: $scheduleId, rating: $rating) {
      _id 
      title
      averageRating
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


export const ADD_COMMENT = gql`
  mutation AddComment($scheduleId: ID!, $comment: String!) {
    addComment(scheduleId: $scheduleId, comment: $comment) {
      _id
      title
      comments {
        _id
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

export const CREATE_DONATION_SESSION = gql`
mutation CreateDonationSession($amount: Float!) {
  createDonationSession(amount: $amount) {
    sessionId
    successUrl
    cancelUrl
    error
  }
}
`;

export const UPDATE_CATEGORY = gql`
mutation updateCategory($scheduleId: ID!, $category: Category!) {
  updateCategory(scheduleId: $scheduleId, category: $category) {
    _id
    category
  }
}
`;

export const UPDATE_TAGS = gql`
mutation updateTags($scheduleId: ID!, $tags: [String]!) {
  updateTags(scheduleId: $scheduleId, tags: $tags) {
    _id
    tags
  }
}
`;


export const DELETE_TAGS = gql`
mutation deleteTag($scheduleId: ID!, $tag: String!) {
  deleteTag(scheduleId: $scheduleId, tag: $tag) {
    _id
    tags
  }
}
`;
