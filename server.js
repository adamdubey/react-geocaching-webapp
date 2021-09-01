const { ApolloServer } = require('apollo-server');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { findOrCreateUser } = require('./controllers/userController');

// MongoDB Config
const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log('DB Connection Established!'))
    .catch(err => console.error(err));

// ApolloServer Config
const server = new ApolloServer({
    cors: {
        origin: '*',
        credentials: true
    },
    typeDefs,
    resolvers,
    introspection: true,
    playgroud: true,

    context: async ({ req }) => {
        let authToken = null;
        let currentUser = null
        try {
            authToken = req.headers.authorization
            if (authToken) {
                // find or create user
                currentUser = await findOrCreateUser(authToken)

            }
        } catch (err) {
            console.log(`Unable to authenticate user with token ${authToken}`);
        }
        return { currentUser }
    }
});

// Server Init
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`Server listening on ${url}`);
});

