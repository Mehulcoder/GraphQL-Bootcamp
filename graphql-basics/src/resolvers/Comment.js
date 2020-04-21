var Comment = {
    author(parent, args, {db}, info){
        return db.users.find((user) => {
            return user.id === parent.author;
        })
    },
    post(parent, args, {db}, info){
        return db.posts.find((pos) => {
            return parent.post === pos.id;
        })
    }
}

export {Comment as default}