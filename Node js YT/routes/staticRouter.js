const express = require("express");
const {restrictTo} = require('../middlewares/auth');

const router = express.Router();

//parent path is /ssr
//inline middleware, with this we can eliminate if condition.
router.get('/',restrictTo(['user','admin']) ,(req, res) =>{
    // if(!req.user) return res.redirect('/ssr/login');
    return res.render("home");
})

router.get('/signup',(req,res)=>{
    if(req.user) return res.redirect('/ssr');
    return res.render("signup");
})

router.get('/login',(req,res)=>{
    if(req.user) return res.redirect('/ssr');
    return res.render("login");
})
module.exports = router;