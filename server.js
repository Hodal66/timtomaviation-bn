require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const { mergeResolvers, mergeTypeDefs } = require("@graphql-tools/merge");

const mongoose = require("mongoose");
const userSchema = require("./schema/UserSchema");
const userResolvers = require("./resolvers/UserResolvers");

const resolvers = mergeResolvers([userResolvers]);

const typeDefs = mergeTypeDefs([userSchema]);

const startServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🌞💥💥💥🔥🔥🔥Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
  server.listen().then(({ url }) => {
    console.log(`++>> Server is Running.... on ${url}`);
  });
};

startServer();
