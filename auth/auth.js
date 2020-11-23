const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

// Passport middleware to handle user login
passport.use(
	'login',
	new LocalStrategy(async (username, password, done) => {
		User.findOne({ username: username }, async (err, user) => {
			if (err) return done(err)

			if (!user) return done(null, false, { message: 'User not found' })

			const validate = await user.isValidPassword(password)
			if (!validate) return done(null, false, { message: 'Wrong Password' })

			return done(null, user, { message: 'Logged in Successfully' })
		})
	})
)

// passport.use(
// 	new JWTstrategy(
// 		{
// 			secretOrKey: 'TOP_SECRET',
// 			jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
// 		},
// 		(token, done) => {
// 			try {
// 				return done(null, token.user)
// 			} catch (error) {
// 				done(error)
// 			}
// 		}
// 	)
// )

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

exports.verifyToken = function (req, res, next) {
	// Get token
	const bearerHeader = req.headers['authorization']
	if (bearerHeader) {
		const token = bearerHeader.split(' ')[1]
		jwt.verify(token, 'TOP_SECRET', (err, authData) => {
			if (err) return next(err)

			req.token = token
			next()
		})
	} else {
		next(new Error('Forbidden'))
	}
}
