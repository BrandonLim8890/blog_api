var express = require('express')
var router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')

/* GET home page. */
router.get('/', function (req, res, next) {
	res.redirect('/posts')
})

router.post('/login', function (req, res, next) {
	passport.authenticate('login', (err, user, info) => {
		if (err) return next(err)

		if (!user) {
			return res.json({ message: info.message })
		}

		console.log(info.message)

		req.login(user, { session: false }, (err) => {
			if (err) return next(err)

			const body = { _id: user._id, username: user.username }
			const token = jwt.sign({ user: body }, 'TOP_SECRET', { expiresIn: '1d' })

			return res.json({ token })
		})
	})(req, res, next)
})

module.exports = router
