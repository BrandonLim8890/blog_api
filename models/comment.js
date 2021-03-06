let mongoose = require('mongoose')
require('mongoose-type-email')
let Schema = mongoose.Schema

let CommentSchema = Schema({
	body: { type: String, required: true },
	time: { type: Date, required: true },
	author: { type: String, required: true },
	post_id: { type: String, required: true }
})

module.exports = mongoose.model('Comment', CommentSchema)
