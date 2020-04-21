import {GraphQLServer} from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

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
    published: 1,
    author: '1'
},{
    id:'11',
    title:"Post2",
    body: "Hello this is the post 2",
    published: 1,
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

    type Mutation{
        createUser(name: String!, email: String!, age:Int): User!
        createPost(title: String!, body:String!, published: Boolean!, author: ID!): Post!
        createComment(text: String!, author: ID!, post: ID!): Comment!
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
    Mutation:{
        createUser(parent, args, ctx, info){
            var emailTaken = users.some((user) => {
                return user.email === args.email;
            })
            if(emailTaken){
                throw new Error("Email has already been taken");
            }

            var user = {
                id: uuidv4(),
                ...args
            }

            users.push(user);
            return user;
        },

        createPost(parent, args, ctx, info){
            var userExist = users.some((user) => {
                // console.log(user.id, args.author);  
                return user.id === args.author;
            })

            var post = {
                id: uuidv4,
                ...args
            }

            if (!userExist) {
                throw new Error("Author user does not exist!");
            }

            if(userExist){
                posts.push(post);
            }

            return post;
        },
        createComment(parent, args, ctx, info){
            var userExist = users.some((user) => {
                return user.id===args.author
            })

            var postExist = posts.some((post) => {
                return post.id === args.post && post.published;
            })

            var comment = {
                id: uuidv4,
                ...args

            }

            if (!userExist || !postExist ) {
                console.log(userExist , postExist);
                throw new Error("Unable to find user and post!")
            }

            if (postExist && userExist) {
                comments.push(comment)
            }

            return comment;
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
        },
        post(parent, args, ctx, info){
            return posts.find((pos) => {
                return parent.post === pos.id;
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