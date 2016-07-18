var mongoose = require('mongoose');

var ToGoSchema = mongoose.Schema({
	name: { type: String, unique: true, required: true },
	url: { type: String }
});

var ToGo = mongoose.model('ToGo', ToGoSchema);

module.exports = ToGo;