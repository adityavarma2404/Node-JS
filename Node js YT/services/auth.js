// const sessionIdToUserMap = new Map();

// // drawback
// // 1. if a user manually deletes the cookie, sessionIdToUserMap will still holds the past credentials. If user login again, sessionIdToUserMap will store the same credentials with different uid. 
// //2. when the server restarts, the sessionIdToUserMap will create new Map() and doesnt hold any uid's and cred's. user need to login again.

// function setUser(id, user){
//     sessionIdToUserMap.set(id,user);
// }
// function getUser(id){
//     console.log(sessionIdToUserMap);
//    return sessionIdToUserMap.get(id);
// }



// JWT implementation
const jwt = require('jsonwebtoken');
const secret = 'AdItyA@1605!1999#';

function setUser(user){
    return jwt.sign({
        _id: user._id,
        email:user.email,
        role: user.role
    },secret);
}

function getUser(token){
    if(!token) return null
    //when you try to manually change the JWT token and refresh the page, the server will crash so used try catch blocks
    try{
        return jwt.verify(token, secret)
    }catch(err){
        return null
    }
}

module.exports = {setUser, getUser};