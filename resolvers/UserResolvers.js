const { Query } = require("mongoose");
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const userResolvers = {
  Query: {
    getAllUsers: async () => {
      try {
        return await User.find({});
      } catch (error) {
        throw new Error("Error In Fetching Users");
      }
    },
  },
  Mutation: {
    signUp: async (_, args, context) => {
      // Corrected spelling
      try {
        const { input } = args;
        const { fullName, email, telephone, password } = input;

        console.log("Here is what you want to create: ", input);

        //Let us first check if the user is already exist in the database

        const checkExistingUser = await User.findOne({ email });
        if (checkExistingUser) {
          throw new Error(
            `The user with this email:${email} is Already Exist !`
          );
        }
        //let us encript the password
        const hashedPassword = await bcrypt.hash(password, 12);
        //let us construct new user and insert into the database
        const newUser = new User({
          fullName,
          email,
          telephone,
          password: hashedPassword,
        });
        const result = await newUser.save();
        console.log("New User that have been saved is:", result);
        return result;
      } catch (error) {
        console.error(error);
        throw new Error(error.message || "An unknown error occurred.");
      }
    },
  },
};

module.exports = userResolvers;
