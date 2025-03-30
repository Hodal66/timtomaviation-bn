// require("dotenv").config();
// const { ApolloServer } = require("apollo-server");
// const { mergeResolvers, mergeTypeDefs } = require("@graphql-tools/merge");
// const mongoose = require("mongoose");
// const cors = require("cors"); // Import CORS
// const userSchema = require("./schema/UserSchema");
// const contactUsSchema = require("./schema/ContactUsSchema");
// const userResolvers = require("./resolvers/UserResolvers");
// const contactUsResolvers = require("./resolvers/ContactUsResolvers");

// // Merge resolvers and type definitions
// const resolvers = mergeResolvers([userResolvers, contactUsResolvers]);
// const typeDefs = mergeTypeDefs([userSchema, contactUsSchema]);

// const startServer = async () => {
//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     cors: {
//       origin: "*", // Allow all origins (for dev) - Change in production
//       credentials: true,
//     },
//   });

//   try {
//     await mongoose.connect(process.env.MONGODB_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ Connected to MongoDB");
//   } catch (error) {
//     console.error("❌ Error connecting to MongoDB:", error);
//     process.exit(1);
//   }

//   server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
//     console.log(`🚀 Server is Running on ${url}`);
//   });
// };

// startServer();

require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const { mergeResolvers, mergeTypeDefs } = require("@graphql-tools/merge");
const mongoose = require("mongoose");
const { RedisCache } = require("apollo-server-cache-redis"); // Redis Cache
const userSchema = require("./schema/UserSchema");
const contactUsSchema = require("./schema/ContactUsSchema");
const userResolvers = require("./resolvers/UserResolvers");
const contactUsResolvers = require("./resolvers/ContactUsResolvers");

// Merge resolvers and type definitions
const resolvers = mergeResolvers([userResolvers, contactUsResolvers]);
const typeDefs = mergeTypeDefs([userSchema, contactUsSchema]);

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Configure Cache (Choose either Redis or In-Memory)
    const cache = process.env.REDIS_URL
      ? new RedisCache({ host: process.env.REDIS_URL }) // Use Redis if available
      : undefined; // Default to Apollo’s in-memory cache

    // Create Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      cache, // Use caching backend
      context: ({ req }) => ({ req }), // Context for authentication (if needed)
      cors: {
        origin: process.env.CLIENT_URL || "*", // Restrict origins in production
        credentials: true,
      },
    });

    // Start the server
    server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
      console.log(`🚀 Server is Running at ${url}`);
    });
  } catch (error) {
    console.error("❌ Error Starting Server:", error);
    process.exit(1);
  }
};

startServer();
