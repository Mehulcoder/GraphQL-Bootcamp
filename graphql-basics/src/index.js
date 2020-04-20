import {GraphQLServer} from 'graphql-yoga';

//Demo user data
var users = [{
    id: '1',
    name: "Mehul",
    age: 20,
    email: "mehul355180@gmail.com"
},{
    id: '2',
    name: "Sarthak",
    age: 17,
    email: "sarthak355180@gmail.com"
}]

//Demo posts data
var posts = [{
    id:'10',
    title:"Post1",
    body: "Hello this is the post 1",
    published: 0,
    author: '1'
},{
    id:'11',
    title:"Post2",
    body: "Hello this is the post 2",
    published: 0,
    author: '2'
}]

//Comments Array
var comments = [{
    id:'21',
    text:'Hello ji this is by Mehull on Post2',
    author:'1',
    post:'11'
}]

//Type definition (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        me: User!
        post: Post!
    }

    type User{
        id: ID!
        name: String!
        age: Int
        email: String!
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post{
        id: ID!
        title: String!
        body:String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment{
        id:ID!
        text: String!
        author: User!
        post: Post!
    }

` 

//Resolvers
const resolvers = {
    Query:{
        posts(parent, args, ctx, info){
            if(!args.query){
                return posts;
            }else{
                return posts.filter((post) => {
                    return (post.title.toLowerCase().includes(args.query.toLowerCase())
                    || post.body.toLowerCase().includes(args.query.toLowerCase()));
                })
            }
        },

        users(parent, args, ctx, info){
            if (!args.query) {
                return users;
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase());
            })
        },

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
        },

        comments(){
            return comments;
        }
    },
    Post:{
        author(parent, args, ctx, info){
            return users.find((user) => {
                return user.id === parent.author;
            })
        },
        comments(parent, args, ctx, info){
            return comments.filter((comment) => {
                return  comment.post === parent.id;
            })
        }
    },
    User:{
        posts(parent, args, ctx, info){
            return posts.filter((post) => {
                return parent.id === post.author;
            })
        },
        comments(parent,args,ctx,info){
            return comments.filter((comment) => {
                return comment.author === parent.id;
            })
        }
    },
    Comment:{
        author(parent, args, ctx, info){
            return users.find((user) => {
                return user.id === parent.author;
            })
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