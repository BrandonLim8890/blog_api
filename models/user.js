let mongoose = require('mongoose')
require('mongoose-type-email')
const bcrypt = require('bcryptjs')
let Schema = mongoose.Schema

let UserSchema = Schema({
	first: { type: String, required: true, maxlength: 100 },
	last: { type: String, required: true, maxlength: 100 },
	username: { type: mongoose.SchemaTypes.Email, required: true, maxlength: 100 },
	password: { type: String, required: true }
})

// Virtual
UserSchema.virtual('url').get(function () {
	return `/users/${this.id}`
})

UserSchema.virtual('fullname').get(function () {
	return `${this.first} ${this.last}`
})

// Method to ensure the log in has the correct credentials.
UserSchema.methods.isValidPassword = function (password) {
	return bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', UserSchema)
