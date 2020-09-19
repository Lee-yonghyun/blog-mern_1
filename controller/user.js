const jwt = require('jsonwebtoken')
const userModel = require('../models/user')

function tokenGenerator (payload) {
    return jwt.sign(
        payload,
        process.env.SECRETKEY,
        {expiresIn: '1d'}
    )
}

exports.register_user = (req,res) => {

    const {name, email, password} = req.body;

    userModel
        .findOne({email})
        .then(user => {
            if (user) {
                return res.json({
                    message:'email already existed'
                });
            }

            else{

                const newUser = new userModel({
                    name,
                    email,
                    password
                })

                newUser
                    .save()
                    .then(user => {

                        console.log(user);

                        res.json({
                            message:'saved data',
                            userInfo:{
                                id:user._id,
                                name:user.name,
                                email:user.email,
                                password:user.password,
                                avatar:user.avatar,
                                date:{
                                    createDate:user.createdAt,
                                    updateData:user.updatedAt
                                }
                            }
                        })
                    })
                    .catch(err => {
                        res.json({
                            message:err.message
                        })
                    })
            }
        })

        .catch(err => {
            res.json({
                message:err.message
            })
        })
};


exports.login_user = (req, res) => {

    const {email, password} = req.body

    userModel
        .findOne({email})
        .then(user => {

            if (!user) {
                return res.json({
                    message: 'your email wrong'
                })
            } else {
                //user가 등록되어 있다면?
                user.comparePassword(password, (err, result) => {
                    if (err || result === false) {
                        return res.json({
                            message: "password incorrect"
                        })
                    } else {

                        const payload = {id: user._id, name:user.name, email:user.email, avatar: user.avatar}

                        res.json({
                            success: result,
                            token: tokenGenerator(payload)
                        })
                    }
                })
            }
        })

        .catch(err => {
            res.json({
                message:err.message
            })
        })
};


exports.current_user = (req,res) => {

    res.json({
        id: req.user.id,
        email:req.user.email,
        name:req.user.name,
        avatar:req.user.avatar,
        // password:req.user.password
    })
}


exports.all_user = (req,res) => {

    userModel
        .findById(req.user.id) //passport의 return된 user값
        .then(user => {

            if(user.role !== "admin") {
                return res.json({
                    message:"you are not admin"
                })
            }

            else{
                userModel
                    .find()
                    .then(users => res.json(users))
                    .catch(err => {
                        res.json({
                            message:err.message
                        })
                    })
            }
        })
        .catch(err => {
            res.json({
                message:err.message
            })
        })
}