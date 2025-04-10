// require("dotenv").config();
// const { ApolloServer } = require("apollo-server");
// const { mergeResolvers, mergeTypeDefs } = require("@graphql-tools/merge");
// const mongoose = require("mongoose");
// const { RedisCache } = require("apollo-server-cache-redis"); // Redis Cache
// const userSchema = require("./schema/UserSchema");
// const contactUsSchema = require("./schema/ContactUsSchema");
// const userResolvers = require("./resolvers/UserResolvers");
// const contactUsResolvers = require("./resolvers/ContactUsResolvers");

// // Merge resolvers and type definitions
// const resolvers = mergeResolvers([userResolvers, contactUsResolvers]);
// const typeDefs = mergeTypeDefs([userSchema, contactUsSchema]);

// const startServer = async () => {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGODB_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ Connected to MongoDB");

//     // Configure Cache (Choose either Redis or In-Memory)
//     const cache = process.env.REDIS_URL
//       ? new RedisCache({ host: process.env.REDIS_URL }) // Use Redis if available
//       : undefined; // Default to Apollo’s in-memory cache

//     // Create Apollo Server
//     const server = new ApolloServer({
//       typeDefs,
//       resolvers,
//       cache, // Use caching backend
//       context: ({ req }) => ({ req }), // Context for authentication (if needed)
//       cors: {
//         origin: process.env.CLIENT_URL || "*", // Restrict origins in production
//         credentials: true,
//       },
//     });

//     // Start the server
//     server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
//       console.log(`🚀 Server is Running at ${url}`);
//     });
//   } catch (error) {
//     console.error("❌ Error Starting Server:", error);
//     process.exit(1);
//   }
// };

// startServer();
require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { mergeResolvers, mergeTypeDefs } = require("@graphql-tools/merge");
const mongoose = require("mongoose");

const userSchema = require("./schema/UserSchema");
const contactUsSchema = require("./schema/ContactUsSchema");
const userResolvers = require("./resolvers/UserResolvers");
const contactUsResolvers = require("./resolvers/ContactUsResolvers");

// Merge schema and resolvers
const typeDefs = mergeTypeDefs([userSchema, contactUsSchema]);
const resolvers = mergeResolvers([userResolvers, contactUsResolvers]);

async function startServer() {
  const app = express();

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({ req }),
    });

    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });

    // Add a basic route
    app.get("/", (req, res) => {
      res.send("🚀 Apollo Server is Running!");
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err);
  }
}

startServer();
