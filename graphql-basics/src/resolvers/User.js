var User = {
    posts(parent, args, {db}, info){
        return db.posts.filter((post) => {
            return parent.id === post.author;
        })
    },
    comments(parent,args,{db},info){
        return db.comments.filter((comment) => {
            return comment.author === parent.id;
        })
    }
}

export {User as default}