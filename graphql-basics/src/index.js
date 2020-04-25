import {GraphQLServer} from 'graphql-yoga';
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'
import User from './resolvers/User'


//Resolvers
const resolvers = {
    
}

//Setting up server
const server = new GraphQLServer({
    typeDefs:'src/schema.graphql',
    resolvers:{
        Query,
        Mutation,
        User,
        Post,
        Comment,
    },
    context:{
        db
    }
})

server.start(() => {
    console.log("The server is up and working!");
})