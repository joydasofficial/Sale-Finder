require('dotenv').config({path: "./config.env"});

const { applyMiddleware } = require("graphql-middleware");
const { makeExecutableSchema } = require("@graphql-tools/schema");

const express = require('express');
const cors = require('cors'); 

const connectDB = require('./config/db.config');
const errorHandler = require('./middleware/errorHandler');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/typedefs')
const resolvers = require('./graphql/resolvers');
const permissions = require('./Shield');

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
// app.use(errorHandler);

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
})

const schemaWithMiddleware = applyMiddleware(schema, permissions);

const server = new ApolloServer({
    schema: schemaWithMiddleware,
    resolvers,
    context: ({ req, reply }) => ({
        req,
        reply,
      }),
})

server.listen(PORT, ()=>{
    console.log(`Server running at ${PORT}`);
})

// process.on("unhandledRejection", (err, promise)=>{
//     console.log(`Logged error ${err}`);
//     server.close(()=>process.exit(1));
// })