const express = require('express')
const router = express.Router()
const userModel = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const gravatar = require('gravatar')
const {
    register_user,
    login_user
} = require('../controller/user')





//@ 회원가입
router.post('/registor', register_user)

//@ 로그인 : email 유무 -> return jwt

router.post('/login', login_user)


module.exports = router