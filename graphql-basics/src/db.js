
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

var db = {
    users,
    posts,
    comments
}

export {db as default}