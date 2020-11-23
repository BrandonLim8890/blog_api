const { body, sanitizeBody, validationResult } = require('express-validator')
let Comment = require('../models/comment')
let Post = require('../models/post')
let async = require('async')

// POST for new comment
exports.new_comment_post = [
	// Validate fields
	body('body', 'Comment must not be empty.').isLength({ min: 1 }).trim(),

	// Sanitize
	sanitizeBody('body').escape(),

	// Process
	(req, res, next) => {
		// Extract errors
		const errors = validationResult(req)

		// Create new comment
		let comment = new Comment({
			body: req.body.body,
			time: new Date().toLocaleDateString(),
			author: req.body.author,
			post_id: req.params.id
		})

		if (!errors.isEmpty()) {
			// There are errors
			// Re-render page with errors
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
			return
		} else {
			// Comment is successful.
			comment.save(function (err) {
				if (err) return next(err)

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
						console.log('post successful')
						res.json({ title: results.post.title, post: results.post, comments: results.comments })
					}
				)
			})
		}
	}
]

exports.delete_comment_delete = function (req, res, next) {
	Comment.findById(req.params.id).exec(function (err, comment) {
		if (err) return next(err)

		var { post_id } = comment

		Comment.findByIdAndDelete(req.params.id, function (err) {
			if (err) return next(err)
			res.redirect(303, `/posts/${post_id}`)
		})
	})
}
