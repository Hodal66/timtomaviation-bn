const { Query } = require("mongoose");
const ContactUs = require("../models/ContactUsModel");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const contactUsResolvers = {
  Query: {
    getAllContactUs: async () => {
      try {
        return await ContactUs.find({});
      } catch (error) {
        throw new Error("Error In Fetching ContactUs");
      }
    },
    getContactUsById: async (_, { ContactUsId }) => {
      try {
        console.log("Fetching ContactUs record with ID:", ContactUsId);
        const contact = await ContactUs.findById(ContactUsId);
        if (!contact) {
          throw new Error("ContactUs record not found!");
        }
        return contact;
      } catch (error) {
        console.error("Error fetching ContactUs record:", error);
        throw new Error("Error fetching ContactUs: " + error.message);
      }
    },
  },
  Mutation: {
    createContactUs: async (_, args, context) => {
      try {
        const { input } = args;
        const { fullName, email, telephone, message } = input;

        console.log("Here is what you want to create: ", input);

        const newContactInformation = new ContactUs({
          fullName,
          email,
          telephone,
          message,
        });
        const result = await newContactInformation.save();
        console.log("New User that have been saved is:", result);
        return result;
      } catch (error) {
        console.error(error);
        throw new Error(error.message || "An unknown error occurred.");
      }
    },
    deleteContactUs: async (_, { ContactUsId }) => {
      try {
        const deletedContactInfomation = await ContactUs.findByIdAndDelete(
          ContactUsId
        );
        return !!deletedContactInfomation; // Returns true if user was deleted, false otherwise
      } catch (error) {
        throw new Error("Error deleting user: " + error.message);
      }
    },
  },
};

module.exports = contactUsResolvers;
