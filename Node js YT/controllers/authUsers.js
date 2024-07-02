const {v4: uuidv4} = require('uuid');
const {setUser, getUser} = require('../services/auth');
const AuthUserModel = require('../models/authUsers');
const { use } = require('../routes/users');

// used for sign in. creates new user in DB
async function handleUserSignup(req, res){
    const {name, email, password} = req.body;
    await AuthUserModel.create({
        name, email, password
    })
    return res.redirect('/ssr')
}
// used for log in. checks user in DB
async function handleUserLogin(req, res){
    const {email, password} = req.body;
    const user = await AuthUserModel.findOne({
        email, password
    })
    if(!user){
        return res.render('login', {error: 'Invalid email or password'})
    }
    // to create a session id to store in cookies. sessionID no more required for stateless lo removed
    // const sessionID = uuidv4();
    // setUser(sessionID, user);
    // res.cookie("uid", sessionID);

    //JWT token
    const token = setUser(user);
    res.cookie("token", token)

    return res.redirect('/ssr')

    // to work with mobile application, we just return the token. We ignore adding cookie
    return res.json({token});
    
}

module.exports = {handleUserSignup, handleUserLogin}