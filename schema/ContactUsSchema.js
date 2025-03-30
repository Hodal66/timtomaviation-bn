const { gql } = require("apollo-server");

const contactUsSchema = gql`
  input ContactInput {
    fullName: String!
    email: String!
    telephone: String
    message: String
  }

  type ContactUsToBeReturned {
    _id: ID
    fullName: String
    email: String
    telephone: String
    message: String
  }

  type Query {
    getAllContactUs: [ContactUsToBeReturned]
    getContactUsById(ContactUsId: ID!): ContactUsToBeReturned
  }

  type Mutation {
    createContactUs(input: ContactInput): ContactUsToBeReturned
    deleteContactUs(ContactUsId: ID!): Boolean
  }
`;
module.exports = contactUsSchema;
