var express = require('express'),
		router = express.Router(),
		passport = require('../config/passport.js'),
		User = require('../models/users.js'),
		jwt = require('jsonwebtoken');

router.use(passport.initialize());

router.post("/", passport.authenticate("local", { session: false }), function(req, res, next) {
	console.log(req.user);

	var token = jwt.sign(req.user, process.env.JWT_SECRET, {
		expiresIn: 1440 // Expires in 24 hours
	});
  console.log(req.user._id);
	res.send({id: req.user._id, token: token});
});

module.exports = router;