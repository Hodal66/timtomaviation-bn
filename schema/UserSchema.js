const { gql } = require("apollo-server");

const userSchema = gql`
  input UserInput {
    fullName: String!
    email: String!
    telephone: String!
    password: String!
  }

  type UserToBeReturned {
    _id: ID
    fullName: String
    email: String
    telephone: String
  }

  type Query {
    getAllUsers: [UserToBeReturned]
  }

  type Mutation {
    signUp(input: UserInput): UserToBeReturned
  }
`;

module.exports = userSchema;
