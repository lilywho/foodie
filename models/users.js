var mongoose = require('mongoose'),
		bcrypt = require('bcryptjs'),
		crypto = require('crypto'),
		ToGoSchema = require('./togos').schema;
		HaveGoneSchema = require('./havegones').schema;

var UserSchema = mongoose.Schema({
		email: { type: String, unique: true, required: true },
		username: { type: String, unique: true, required: true },
		password: { type: String, required: true },
		togo: [ToGoSchema],
		havegone: [HaveGoneSchema]
});

UserSchema.pre('save', function(next) {
	if(this.isModified('password')) {
		this.password = bcrypt.hashSync(this.password, 10);
	}
	next();
});

UserSchema.methods.authenticate = function(passwordTry) {
	return bcrypt.compareSync(passwordTry, this.password);
};

var User = mongoose.model('User', UserSchema);
module.exports = User;

