var mongoose = require('mongoose');

var HaveGoneSchema = mongoose.Schema({
	name: { type: String, unique: true, required: true },
	url: { type: String }
});

var HaveGone = mongoose.model('HaveGone', HaveGoneSchema);

module.exports = HaveGone;