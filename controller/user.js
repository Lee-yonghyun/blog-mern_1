const jwt = require('jsonwebtoken')
const userModel = require('../models/user')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.MAIL_KEY)


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

            else {

                const payload = {name, email, password};
                const token = jwt.sign(
                    payload,
                    process.env.JWT_ACCOUNT_ACTIVATION,
                    {expiresIn: "10m"}
                );

                const emailDate = {
                    from: process.env.EMAIL_FROM,
                    to: email,
                    subject: "이메일 인증 요청 메일",
                    html: `
                        <h1>인증요청메일을 전송해 드립니다.</h1>
                        <p>${process.env.CLIENT_URL}/user/activation/${token}</p>
                        <hr/>
                        <hr/>
                        <p>이 이메일은 개인정보를 포함하고 있습니다.</p>
                        <p>${process.env.CLIENT_URL}</p> 
                    `
                };

                sgMail
                    .send(emailDate)
                    .then(() => {
                        return res.status(200).json({
                            message: `이메일이 ${email}로 전송되었습니다.`
                        })
                    })
                    .catch(err => {
                        res.status(400).json({
                            message: err.message
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