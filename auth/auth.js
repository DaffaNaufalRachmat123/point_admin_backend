const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const {users} = require('../models/index')
const { Op } = require('sequelize')
let options = {}
options.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken()
options.secretOrKey = process.env.SECRET_KEY || 'StarkIndustries'

module.exports = passport => {
    passport.use(new JWTStrategy(options , async (jwt_payload , done) => {
        const id = jwt_payload.id
        console.log(jwt_payload)
        try {
            const data = await users.findOne({
                where : {
                    [Op.and] : {
                        id : id,
                        is_user_admin : jwt_payload.is_user_admin
                    }
                }
             })
            console.log(data)
            if(data) return done(null , true)
            else return done(null , false)
        } catch (err) {
            console.log(err)
            return done(null , false)
        }
    }))
}