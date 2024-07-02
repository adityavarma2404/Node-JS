const express = require("express");

const {handleUserSignup, handleUserLogin} = require('../controllers/authUsers');

const router = express.Router();

// parent path is /auth. for sign up page
router.post("/", handleUserSignup);
// for login page
router.post("/login", handleUserLogin);

module.exports = router;