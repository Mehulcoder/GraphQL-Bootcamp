import db from '../db'

var Query = {
    posts(parent, args, {db}, info){
        if(!args.query){
            return db.posts;
        }else{
            return db.posts.filter((post) => {
                return (post.title.toLowerCase().includes(args.query.toLowerCase())
                || post.body.toLowerCase().includes(args.query.toLowerCase()));
            })
        }
    },

    users(parent, args, {db}, info){
        if (!args.query) {
            return db.users;
        }

        return db.users.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase());
        })
    },

    // me(){
    //     return {
    //         id: 'Mehul128',
    //         name: "Mehul",
    //         age: 28
    //     }
    // },

    // post(){
    //     return {
    //         id:'12345',
    //         title: "Hello this is GraphQL",
    //         body: "Hello this is my body",
    //         published: false
    //     }
    // },

    comments(parent, args, ctx, info){
        return db.comments;
    }
}

export {Query as default}