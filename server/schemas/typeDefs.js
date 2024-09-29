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
    category: Category!
    tags: [String]
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

  type SessionResponse {
    sessionId: String
    successUrl: String
    cancelUrl: String
    error: String
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

  enum Category {
    EXERCISE
    NUTRITION
    WORK_PRODUCTIVITY
    HOBBIES_CRAFTS
    EDUCATION
    HOMELIFE
    SOCIAL_LIFE
    MINDFULNESS
    GENERAL
    ALL

  }

  type Query {
    users: [User]
    user(username: String!): User
    me(sortBy: SortBy, sortOrder: SortOrder): User
    getSchedules(category: Category, tags: [String], sortBy: SortBy, sortOrder: SortOrder): [Schedule]  
    getOneSchedule(scheduleId: ID!): Schedule
    searchUsers(term: String!): [User]
    searchSchedules(query: String!, sortBy: SortBy, sortOrder: SortOrder, category: Category, tags: [String]): [Schedule]
    checkUserRating(scheduleId: ID!): Rating
    getRatedSchedules(sortBy: SortBy, sortOrder: SortOrder): [RatedSchedule]
    fetchSchedulesByCategory(category: String!): [Schedule]
  }
  
  
  

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addSchedule(title: String!, activities: [ActivityInput], category: Category!, tags: [String]): Schedule
    updateSchedule(scheduleId: ID!, title: String!, category: Category!, tags: [String]): Schedule
    deleteSchedule(scheduleId: ID!): Schedule
    addActivity(scheduleId: ID!, activityData: ActivityInput!): Schedule
    removeActivity(activityId: ID!): Schedule
    updateActivity(activityId: ID!, title: String, description: String, startTime: String, endTime: String, day: String): Activity
    addRating(scheduleId: ID!, rating: Int!): Schedule
    addComment(scheduleId: ID!, comment: String!): Schedule
    createDonationSession(amount: Float!): SessionResponse
  }
 `;

module.exports = typeDefs;
