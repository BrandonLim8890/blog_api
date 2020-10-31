let mongoose = require('mongoose')

let Schema = mongoose.Schema

let PostSchema = Schema({
	title: { type: String, required: true, maxlength: 100 },
	body: { type: String, required: true },
	timestamp: { type: Date, required: true },
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

// Virtual
PostSchema.virtual('url').get(function () {
	return `/post/${this.id}`
})

module.exports = mongoose.model('Post', PostSchema)
