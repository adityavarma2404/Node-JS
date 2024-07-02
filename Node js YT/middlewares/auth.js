const {getUser} = require("../services/auth");

//to check the cookies to get uid.
async function restrictToLoggedInUserOnly(req, res,next){
    const userUid = req.cookies.uid;

    //to work on mobile application, we dont have cookies, user will send the token in req header.
    // const userUid = req.headers["Authorization"];
    //const token = userUid.split(" ")[1];
    // const user = getUser(token);

    if(!userUid) return res.redirect('/ssr/login');

    const user = getUser(userUid);
    if(!user) return res.redirect('/ssr/login');

    //we found a user with the give id, so we are creating a new attribute to req and passing it to next middlewares.
    req.user = user;
    next()
}
async function checkAuthenticated(req, res,next){
    //to work on mobile application, we dont have cookies, user will send the token in req header.
    // const userUid = req.headers["authorization"];
    //const token = userUid.split(" ")[1];
    // const user = getUser(token);

    const userUid = req.cookies.uid;

    const user = getUser(userUid);

    //we found a user with the give id, so we are creating a new attribute to req and passing it to next middlewares. Used for redirecting to home page
    req.user = user;
    next()
}

//function to remove repetations in checkAuthenticated and restrictToLoggedInUserOnly.
// function checkForAuthentication(req,res,next){
//     const authorisationHeaderValue = req.header['authorization'];
//     req.user = null;

//     if(!authorisationHeaderValue || !authorisationHeaderValue.startsWith("Bearer")) return next()

//     const token = authorisationHeaderValue.split(' ')[1];
//     const user = getUser(token);
//     if(user){
//         req.user = user;
//         next()
//     }else{
//         return res.status(401).send("Unauthorized");
//     }
// }
function checkForAuthentication(req,res,next){
    const tokenCookie = req.cookies.token;
    req.user = null;

    if(!tokenCookie) return next()

    const user = getUser(tokenCookie);
    if(user){
        req.user = user;
        next()
    }else{
        return res.status(401).send("Unauthorized");
    }
}

function restrictTo(roles){
    return function(req,res,next){
        if(!req.user) return res.redirect('/ssr/login');
        if(!roles.includes(req.user.role)) return res.status(403).send("Forbidden");

        return next()
    }
}

module.exports = {restrictToLoggedInUserOnly, checkAuthenticated, checkForAuthentication, restrictTo};