import { v4 as uuidv4 } from 'uuid';

var Mutation = {
    createUser(parent, args, {db}, info){
        var emailTaken = db.users.some((user) => {
            return user.email === args.data.email;
        })
        if(emailTaken){
            throw new Error("Email has already been taken");
        }

        var user = {
            id: uuidv4().toString(),
            ...args.data
        }

        db.users.push(user);
        return user;
    },

    updateUser(parent, {id, data}, {db}, info){
        var user = db.users.find((user) => {
            return user.id === id;
        });

        if (!user) {
            throw new Error("User not found!");
        }

        if (typeof data.email === 'string') {
            const emailTaken = db.users.some((user) => {
                return user.email === data.email;
            })
            if (emailTaken) {
                throw new Error("Email already in use")
            }

            user.email = data.email;            

        }
        if (typeof data.name === 'string') {
            user.name = data.name;
        }

        if (data.age !== undefined) {
            user.age = data.age;
        }

        return user;
    },

    deleteUser(parent, args, {db}, info){
        var userIndex = db.users.findIndex((user) => {
            return args.id === user.id;
        })

        if(userIndex === -1){
            throw new Error("User has not been found!");
        }

        db.posts = db.posts.filter((post) => {
            var match = post.author === args.id;

            if(match){
                db.comments = db.comments.filter((comment) => {
                    return comment.post !== post.id
                })
            }

            return !match;
        })

        db.comments = db.comments.filter((comment) => {
            comment.author != args.id;
        })

        var deletedUsers = db.users.splice(userIndex, 1);
        return deletedUsers[0];
    },

    createPost(parent, args, {db, pubsub}, info){
        var userExist = db.users.some((user) => {
            // console.log(user.id, args.author);  
            return user.id === args.data.author;
        })

        var post = {
            id: uuidv4().toString(),
            ...args.data
        }

        if (!userExist) {
            throw new Error("Author user does not exist!");
        }

        if(userExist){
            db.posts.push(post);
        }
        if (post.published) {
            pubsub.publish(`post`,{post});
        }

        return post;
    },

    updatePost(parent, {id, data}, {db}, info){
        var postExist = db.posts.find((post) => {
            // console.log(post.id)
            return post.id === id;
        })

        if (!postExist) {
            throw new Error("Post not found!");
        }

        if (typeof data.title === "string") {
            postExist.title = data.title;
        }
        if (typeof data.body === "string") {
            postExist.body = data.body;
        }

        if (typeof data.published === "boolean") {
            postExist.published = data.published;
        }

        return postExist;
    },

    deletePost(parent, args, {db}, info){
        var postIndex = db.posts.findIndex((post) => {
            return post.id === args.id;
        });

        if (postIndex===-1) {
            throw new Error("Could not find the post!");
        }

        var deletedPost = db.posts.splice(postIndex,1);
        
        db.comments = db.comments.filter((comment) => {
            return comment.post !== args.id;
        })

        return deletedPost[0];

    },

    createComment(parent, args, {db, pubsub}, info){
        var userExist = db.users.some((user) => {
            return user.id===args.data.author
        })

        var postExist = db.posts.some((post) => {
            return post.id === args.data.post && post.published;
        })

        var comment = {
            id: uuidv4().toString(),
            ...args.data

        }

        if (!userExist || !postExist ) {
            console.log(userExist , postExist);
            throw new Error("Unable to find user and post!")
        }

        if (postExist && userExist) {
            db.comments.push(comment)
        }

        pubsub.publish(`comment ${args.data.post}`, {comment: comment});
        return comment;
    },

    deleteComment(parent, args, {db}, info){
        var commentIndex = db.comments.findIndex((comment) => {
            return comment.id === args.id;
        })

        if (commentIndex===-1) {
            throw new Error("Comment not found");
        }

        var deletedComment = db.comments.splice(commentIndex,1);
        return deletedComment[0];
    }
}


export {Mutation as default}