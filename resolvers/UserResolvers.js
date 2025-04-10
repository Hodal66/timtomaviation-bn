const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");

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
    signUp: async (_, args) => {
      try {
        const { input } = args;
        const { fullName, email, telephone, password } = input;

        console.log("📩 Incoming signup request:", input);

        // Check if user already exists
        const checkExistingUser = await User.findOne({ email });
        if (checkExistingUser) {
          throw new Error(`A user with the email ${email} already exists.`);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Save the new user
        const newUser = new User({
          fullName,
          email,
          telephone,
          password: hashedPassword,
        });

        const result = await newUser.save();
        console.log("✅ New user saved:", result);
        return result;
      } catch (error) {
        console.error("❌ Error in signUp:", error);
        throw new Error(error.message || "An unknown error occurred.");
      }
    },
  },
};

module.exports = userResolvers;
