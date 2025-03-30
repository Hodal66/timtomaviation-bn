require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const { mergeResolvers, mergeTypeDefs } = require("@graphql-tools/merge");
const mongoose = require("mongoose");
const cors = require("cors"); // Import CORS
const userSchema = require("./schema/UserSchema");
const contactUsSchema = require("./schema/ContactUsSchema");
const userResolvers = require("./resolvers/UserResolvers");
const contactUsResolvers = require("./resolvers/ContactUsResolvers");

// Merge resolvers and type definitions
const resolvers = mergeResolvers([userResolvers, contactUsResolvers]);
const typeDefs = mergeTypeDefs([userSchema, contactUsSchema]);

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    cors: {
      origin: "*", // Allow all origins (for dev) - Change in production
      credentials: true,
    },
  });

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }

  server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Server is Running on ${url}`);
  });
};

startServer();
