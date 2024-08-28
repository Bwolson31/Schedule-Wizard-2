const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    schedules(sortBy: SortBy, sortOrder: SortOrder): [Schedule]
  }

  type Schedule {
    _id: ID
    title: String
    activities: [Activity]
    ratings: [Rating]
    comments: [Comment]
    createdAt: String
    updatedAt: String
    ratingCount: Int
    averageRating: Float
  }

  type Activity {
    _id: ID
    title: String
    startTime: String
    endTime: String
    description: String
    day: String
  }

  type Rating {
    _id: ID
    user: User
    rating: Int
    createdAt: String
  }

  type Comment {
    user: User
    comment: String
    createdAt: String
  }

  input ActivityInput {
    title: String
    startTime: String
    endTime: String
    description: String
    day: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type RatedSchedule {
    schedule: Schedule!
    rating: Int!
    comments: [Comment]
  }

  enum SortBy {
    DateCreated
    DateUpdated
    Title
    Popularity
  }

  enum SortOrder {
    NewestFirst
    OldestFirst
    HighestFirst
    LowestFirst
  }

  type Query {
    users: [User]
    user(username: String!): User
    me(sortBy: SortBy, sortOrder: SortOrder): User
    getSchedules(sortBy: SortBy, sortOrder: SortOrder): [Schedule]
    getOneSchedule(scheduleId: ID!): Schedule
    searchUsers(term: String!): [User]
    searchSchedules(term: String!, sortBy: SortBy, sortOrder: SortOrder): [Schedule]
    checkUserRating(scheduleId: ID!): Rating
    getRatedSchedules(sortBy: SortBy, sortOrder: SortOrder): [RatedSchedule]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addSchedule(title: String!, activities: [ActivityInput]): Schedule
    updateSchedule(scheduleId: ID!, title: String!): Schedule
    deleteSchedule(scheduleId: ID!): Schedule
    addActivity(scheduleId: ID!, activityData: ActivityInput!): Schedule
    removeActivity(activityId: ID!): Schedule
    updateActivity(activityId: ID!, title: String, description: String, startTime: String, endTime: String, day: String): Activity
    addRating(scheduleId: ID!, rating: Int!): Schedule
    addComment(scheduleId: ID!, comment: String!): Schedule
  }
 `;

module.exports = typeDefs;
