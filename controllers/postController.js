const { body, sanitizeBody, validationResult } = require('express-validator')
let async = require('async')
let Post = require('../models/post')
let User = require('../models/user')
let Comment = require('../models/comment')
const post = require('../models/post')

exports.list_get = function (req, res, next) {
	Post.find()
		.populate('author')
		.exec(function (err, posts) {
			if (err) return next(err)
			res.json({ title: 'Posts', posts: posts })
		})
}

exports.create_get = function (req, res, next) {
	User.find().exec(function (err, users) {
		if (err) return next(err)

		res.json({ title: 'Create Post', users: users })
	})
}

exports.create_post = [
	// Validate fields
	body('title', 'You must have a title.').isLength({ min: 1 }).trim(),
	body('author', 'You must have an author.').isLength({ min: 1 }).trim(),
	body('body', 'You must have a body.').isLength({ min: 1 }).trim(),

	// Sanitize fields
	sanitizeBody('title').escape(),
	sanitizeBody('author').escape(),
	sanitizeBody('body').escape(),

	// Process request after validation
	(req, res, next) => {
		// Extract errors
		const errors = validationResult(req)

		// New Post Object
		let post = new Post({
			title: req.body.title,
			author: req.body.author,
			timestamp: new Date(),
			body: req.body.body
		})

		if (!errors.isEmpty()) {
			User.find().exec(function (err, users) {
				if (err) return next(err)

				res.json({ title: 'Create Post', post: post, errors: errors.array(), users: users })
			})
			return
		} else {
			post.save(function (err) {
				if (err) return next(err)

				res.redirect(post.url)
			})
		}
	}
]

exports.update_get = function (req, res, next) {
	async.parallel(
		{
			users: function (callback) {
				User.find().exec(callback)
			},
			post: function (callback) {
				Post.findById(req.params.id).exec(callback)
			}
		},
		function (err, results) {
			if (err) return next(err)

			res.json({ title: 'Update Post', users: results.users, post: results.post })
		}
	)
}

exports.update_post = [
	// Validate fields
	body('title', 'You must have a title.').isLength({ min: 1 }).trim(),
	body('author', 'You must have an author.').isLength({ min: 1 }).trim(),
	body('body', 'You must have a body.').isLength({ min: 1 }).trim(),

	// Sanitize fields
	sanitizeBody('title').escape(),
	sanitizeBody('author').escape(),
	sanitizeBody('body').escape(),

	// Process request after validation
	(req, res, next) => {
		// Extract errors
		const errors = validationResult(req)

		// New Post Object
		let post = new Post({
			title: req.body.title,
			author: req.body.author,
			timestamp: new Date(),
			body: req.body.body,
			_id: req.params.id
		})

		if (!errors.isEmpty()) {
			User.find().exec(function (err, users) {
				if (err) return next(err)

				res.json({ title: 'Update Post', post: post, users: users, errors: errors.array() })
			})
			return
		} else {
			Post.findByIdAndUpdate(req.params.id, post, {}, function (err, updated_post) {
				if (err) return next(err)
				res.redirect(303, updated_post.url)
			})
		}
	}
]

exports.post_get = function (req, res, next) {
	async.parallel(
		{
			post: function (callback) {
				Post.findById(req.params.id).exec(callback)
			},
			comments: function (callback) {
				Comment.find({ post_id: req.params.id }).exec(callback)
			}
		},
		function (err, results) {
			if (err) return next(err)

			res.json({ title: results.post.title, post: results.post, comments: results.comments })
		}
	)
}

exports.post_delete = function (req, res, next) {
	Comment.find({ author: req.params.id }).exec(function (err, comments) {
		if (err) return next(err)

		for (let comment in comments) {
			Comment.findByIdAndDelete(comment.id, function (err, result) {
				if (err) return next(err)
			})
		}

		Post.findByIdAndDelete(req.params.id, function (err) {
			if (err) return next(err)

			res.redirect(303, '/posts')
		})
	})
}
