import {GraphQLServer} from 'graphql-yoga';

//String, Boolean, int, float, ID

//Type definition (schema)
const typeDefs = `
    type Query {
        me: User!
        post: Post!
    }

      
    type User{
        id: ID!
        name: String!
        age: Int
    }

    type Post{
        id: ID!
        title: String!
        body:String!
        published: Boolean!
    }

` 

//Resolvers
const resolvers = {
    Query:{
        me(){
            return {
                id: 'Mehul128',
                name: "Mehul",
                age: 28
            }
        },

        post(){
            return {
                id:'12345',
                title: "Hello this is GraphQL",
                body: "Hello this is my body",
                published: false
            }
        }
    }
}

//Setting up server
const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log("The server is up and working!");
})