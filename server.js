// ----------------------------------------
// REQUIREMENTS
// ----------------------------------------
var express = require('express'),
	app = express(),
	morgan = require('morgan'),
	mongoose = require('mongoose'),
	methodOverride = require('method-override'),
	bodyParser = require("body-parser"),
	cookieParser = require('cookie-parser'),
	ngrok = require('ngrok'),
	db = process.env.MONGODB_URI || 'mongodb://localhost/foodie',
	port = process.env.PORT || 3000;

// ----------------------------------------
// MIDDLEWARE
// ----------------------------------------
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// ----------------------------------------
// DATABASE
// ----------------------------------------
mongoose.Promise = global.Promise;
mongoose.connect(db);

// ----------------------------------------
// CONTROLLERS
// ----------------------------------------
var usersController = require('./controllers/users.js');
app.use('/users', usersController);

var authController = require('./controllers/auth.js');
app.use('/auth', authController);

// ----------------------------------------
// SERVER
// ----------------------------------------
app.listen(port);
console.log('(ﾉಥ益ಥ）ﾉ﻿ ┻━┻');

ngrok.connect({
	proto: 'http', 
	addr: port,  
	auth: 'user:pwd', 
	region: 'us'
}, function (err, url) {
});
