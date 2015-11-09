var mongoose = require("mongoose");

var User = mongoose.Schema({
	phone: String
});

module.exports = mongoose.model('User', User);