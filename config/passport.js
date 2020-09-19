const {Strategy, ExtractJwt} = require('passport-jwt')
const  userModel = require('../models/user')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.SECRETKEY

module.exports = passport => {

    passport.use(
        // verify 를 (payload, done)를 이용하여 한다.
        new Strategy(opts, (payload, done) => {
            userModel
                .findById(payload.id)
                .then(user => {
                    if(!user) {
                        return done(null, false);
                    }
                    else {
                        done(null, user)
                    }
                })
                .catch(err => console.log(err))
        })
    )
}





