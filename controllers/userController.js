const { body, sanitizeBody, validationResult } = require('express-validator')
let User = require('../models/user')
const bcrypt = require('bcryptjs')

// Display list of all users
exports.list_get = function (req, res, next) {
	User.find()
		.sort({ last: 'asc' })
		.exec(function (err, list_users) {
			if (err) return next(err)
			// Success, render page with user list
			res.json({ title: 'User List', user_list: list_users })
		})
}

// Display form on create GET
exports.create_get = function (req, res, next) {
	res.json({ title: 'Create User' })
}

// Handle user create on POST
exports.create_post = [
	// Validate fields
	body('first')
		.isLength({ min: 1 })
		.trim()
		.withMessage('First Name must be specified.')
		.isAlphanumeric()
		.withMessage('First Name must be alphanumeric.'),
	body('last')
		.isLength({ min: 1 })
		.trim()
		.withMessage('Last Name must be specified.')
		.isAlphanumeric()
		.withMessage('Last Name must be alphanumeric.'),
	body('username', 'Username must be an email').isEmail(),
	body('password', 'Password must be at least 5 characters long.').isLength({ min: 5 }),
	body('confirm_password', 'Passwords must match!')
		.exists()
		.custom((value, { req }) => value === req.body.password),

	// Sanitize fields
	sanitizeBody('first').escape(),
	sanitizeBody('last').escape(),
	sanitizeBody('username').escape(),
	sanitizeBody('password').escape(),
	sanitizeBody('confirm_password').escape(),

	// Process request after validation
	(req, res, next) => {
		// Extract errors
		const errors = validationResult(req)

		// Encrypt password
		bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
			if (err) return next(err)

			// No errors, create user with hashed password
			let user = new User({
				first: req.body.first,
				last: req.body.last,
				username: req.body.username,
				password: hashedPassword
			})

			if (!errors.isEmpty()) {
				// There are errors, re-render form
				res.json({ title: 'Create User', user: user, errors: errors.array() })
				return
			} else {
				// Data from the form is valid. Save the user and redirect
				user.save(function (err) {
					if (err) return next(err)

					// Succes, redirect
					res.redirect('/users')
				})
			}
		})
	}
]

// Displays update form on GET
exports.update_get = function (req, res, next) {
	User.findById(req.params.id).exec(function (err, user) {
		if (err) return next(err)

		res.json({ title: 'Update User', user: user })
	})
}

// Handle update on PUT
exports.update_put = [
	// Validate fields
	body('first')
		.isLength({ min: 1 })
		.trim()
		.withMessage('First Name must be specified.')
		.isAlphanumeric()
		.withMessage('First Name must be alphanumeric.'),
	body('last')
		.isLength({ min: 1 })
		.trim()
		.withMessage('Last Name must be specified.')
		.isAlphanumeric()
		.withMessage('Last Name must be alphanumeric.'),
	body('username', 'Username must be an email').isEmail(),
	body('password', 'Password must be at least 5 characters long.').isLength({ min: 5 }),
	body('confirm_password', 'Passwords must match!')
		.exists()
		.custom((value, { req }) => value === req.body.password),

	// Sanitize fields
	sanitizeBody('first').escape(),
	sanitizeBody('last').escape(),
	sanitizeBody('username').escape(),
	sanitizeBody('password').escape(),
	sanitizeBody('confirm_password').escape(),

	// Process request after validation
	(req, res, next) => {
		// Extract errors
		const errors = validationResult(req)

		// Encrypt password
		bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
			if (err) return next(err)

			// No errors, create user with hashed password and old id
			let user = new User({
				first: req.body.first,
				last: req.body.last,
				username: req.body.username,
				password: hashedPassword,
				_id: req.params.id // Required or else ID will be reassigned.
			})

			if (!errors.isEmpty()) {
				// There are errors, re-render form
				res.json({ title: 'Update User', user: user, errors: errors.array() })
				return
			} else {
				// Data from the form is valid. Update the user and redirect
				User.findByIdAndUpdate(req.params.id, user, {}, function (err, updated_user) {
					if (err) return next(err)
					res.redirect(updated_user.url)
				})
			}
		})
	}
]

exports.user_get = function (req, res, next) {
	User.findById(req.params.id).exec(function (err, user) {
		if (err) return next(err)

		res.json({ user: user })
	})
}
