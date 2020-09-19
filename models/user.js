const mongoose = require('mongoose')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')



const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: true
        },
        avatar:{
            type:String
        },
        role:{
            type:String,
            default:"user"
        },
        resetPasswordLink: ""
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function(next) {

    try{
        const avatar = gravatar.url(this.email, {
            s: "200", //크기
            r: "pg", //형식
            d: "mm" //단위
        });

        this.avatar = avatar; //this는 현재 모듈(파일)의 schema

        const salt = await bcrypt.genSalt(10); //10자리 암호

        const passwordHash = await bcrypt.hash(this.password , salt)

        this.password = passwordHash

        next()
    }

    catch (err) {
        next(err)
    }

})


userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password,  function (err, result) {
        if(err || result === false) {
            return callback(err) // result 자리인데 false
        }
        callback(null, result) // else , return 값이 생략된 문장., return 값은 true
    })
}

// comparePassword의 return 값은 err / false / true

module.exports = mongoose.model('user',userSchema)