import { gql } from '@apollo/client';

//Query to fetch all users

export const GET_USERS = gql`
 query Users {
  users {
    _id
    email
    username
    schedules {
      _id
      title
      activities {
        _id
        description
        endTime
        startTime
        title
      }
    }
  }
}
`;

// Query to fetch user data for a single user

export const GET_USER = gql`
query User($username: String!) {
  user(username: $username) {
    _id
    email
    username
    schedules {
      _id
      title
      activities {
        _id
        description
        endTime
        startTime
        title
      }
    }
  }
}
`;

//Query to fetch user data for the owner of the acccount
export const ME = gql`
query Me($sortBy: SortBy, $sortOrder: SortOrder) {
  me(sortBy: $sortBy, sortOrder: $sortOrder) {
    _id
    email
    username
    schedules {
      _id
      title
      category
      tags
      averageRating
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
}
`;


// Query to fetch all schedules

export const GET_SCHEDULES = gql`
query GetSchedules($sortBy: SortBy, $sortOrder: SortOrder) {
  getSchedules(sortBy: $sortBy, sortOrder: $sortOrder) {
    _id
    title
    category
    tags
    averageRating
    activities {
      _id
      description
      endTime
      startTime
      title
      day
    }
    ratings {
      user {
        _id
        username
      }
      rating
      createdAt
    }
    comments {
      user {
        _id
        username
      }
      comment
      createdAt
    }
    createdAt
    updatedAt
  }
}
`;


export const GET_ONE_SCHEDULE = gql`
  query getOneSchedule($scheduleId: ID!) {
    getOneSchedule(scheduleId: $scheduleId) {
      _id
      title
      averageRating
      category
      tags
      activities {
        _id
        title
        startTime
        endTime
        description
        day
      }
      ratings {
        user {
          _id
          username
        }
        rating
        createdAt
      }
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
`

export const SEARCH_USERS = gql`
query SearchUsers($term: String!) {
  searchUsers(term: $term) {
    _id
    username
    email
    schedules {
      _id
      title
    }
  }
}

`;

// Query for searching schedules
export const SEARCH_SCHEDULES = gql`
query SearchSchedules($query: String!, $category: Category, $tags: [String], $sortBy: SortBy, $sortOrder: SortOrder) {
  searchSchedules(query: $query, category: $category, tags: $tags, sortBy: $sortBy, sortOrder: $sortOrder) {
    _id
    title
    category
    averageRating
    tags
    activities {
      _id
      description
      startTime
      endTime
      title
    }
  }
}
`;



// Query to fetch rated schedules
export const GET_RATED_SCHEDULES = gql`
  query GetRatedSchedules($sortBy: SortBy, $sortOrder: SortOrder) {
    getRatedSchedules(sortBy: $sortBy, sortOrder: $sortOrder) {
      schedule {
        _id
        title
        createdAt
        activities {
          _id
          title
        }
      }
      rating
    }
  }
`;

export const FETCH_SCHEDULES_BY_CATEGORY = gql`
  query FetchSchedulesByCategory($category: String) {
    fetchSchedulesByCategory(category: $category) {
      _id
      title
      category
      tags
    }
  }
`;





