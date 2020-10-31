let mongoose = require('mongoose')
require('mongoose-type-email')
let Schema = mongoose.Schema

let UserSchema = Schema({
	first: { type: String, required: true, maxlength: 100 },
	last: { type: String, required: true, maxlength: 100 },
	username: { type: mongoose.SchemaTypes.Email, required: true, maxlength: 100 },
	password: { type: String, required: true }
})

// Virtual
UserSchema.virtual('url').get(function () {
	return `/user/${this.id}`
})

UserSchema.virtual('fullname').get(function () {
	return `${this.first} ${this.last}`
})

module.exports = mongoose.model('User', UserSchema)