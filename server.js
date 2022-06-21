require('dotenv').config({path: "./config.env"});

// const { promise } = require('') 'bcrypt/promises';
const express = require('express');
const cors = require('cors'); 

const connectDB = require('./config/db.config');
const errorHandler = require('./middleware/errorHandler');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/typedefs')
const resolvers = require('./graphql/resolvers')

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
// app.use("/api/auth", require("./routes/auth.routes"));
// app.use("/api/private", require("./routes/private.routes"))
app.use(errorHandler);

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server.listen(PORT, ()=>{
    console.log(`Server running at ${PORT}`);
})

// process.on("unhandledRejection", (err, promise)=>{
//     console.log(`Logged error ${err}`);
//     server.close(()=>process.exit(1));
// })