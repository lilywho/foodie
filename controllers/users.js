// ----------------------------------------
// REQUIREMENTS
// ----------------------------------------
var express = require('express'),
		router = express.Router(),
		passport = require('../config/passport.js'),
		request = require("request"),
		User = require('../models/users.js'),
		ToGo = require('../models/togos.js');
		HaveGone = require('../models/havegones.js');
		Yelp = require('yelp');

// ----------------------------------------
// Yelp API Request
// ----------------------------------------
var yelp = new Yelp({
  consumer_key: process.env.YELP_KEY,
  consumer_secret: process.env.YELP_SECRET,
  token: process.env.YELP_TOKEN2,
  token_secret: process.env.YELP_T_SECRET2
  // consumer_key: "4t-J54jwjfYt5NADUfbn5A",
  // consumer_secret: "DgxRml_2U5NY-2uviOR1biFIi_8",
  // token: "9hb4jlCrnAFVBUyGc2cDFYvJKWzrnvN6",
  // token_secret: "s-zOYEFX7hFbS1VhtL1pJv5avvg"
});

router.get("/places/:term/:location/:limit", function(req, res) {
	console.log("Hitting the route.")
	yelp.search({ term: req.params.term, location: req.params.location, limit: req.params.limit })
	.then(function (data) {
	  console.log(data);
	  res.send(data);
	})
	.catch(function (err) {
	  console.error(err);
	});
});

// ----------------------------------------
// WITHOUT AUTHENTICATION
// ----------------------------------------
// Create user
router.post("/", function(req, res) {
	// console.log(req);
	User.create(req.body, function(err, user) {
		console.log("Hitting users controller.")
		if(err) {
			console.log(err);
			res.status(500).end();
		}
		console.log("User created.");
		console.log(user);
		res.send(user);
 	});
});

// ----------------------------------------
// WITH AUTHENTICATION
// ----------------------------------------
router.use(passport.authenticate("jwt", { session: false }));

// Get "To Go" List
router.get("/:id/togos", function(req, res) {
	console.log('Getting "to go" list.');
	User.findById(req.params.id).then(function(user) {
		console.log('in get /:id/togos findByID callback');
		console.log("User is: ", user);
		res.send(user.togo);
	});
	console.log("To gos data sent.")
});

// Get "Have Gone" List
router.get("/:id/havegones", function(req, res) {
	console.log('Getting "have gone" list.');
	User.findById(req.params.id).then(function(user) {
		res.send(user.havegone);
	});
});

// Add Item to "To Go" List
router.post("/:id/togos", function(req, res) {
	console.log('Adding item to "to go" list.');
	console.log(req.body);
	User.findById(req.params.id).then(function(user) {
		console.log('-------------------------------');
		console.log('in post /:id/togos findById callback');
		console.log('req.body: ', req.body);
		console.log('user: ', user);
		var togo = new ToGo(req.body);
		togo.save(function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log('New "to go" item was added.');
			}
		});
		user.togo.push(togo);
		user.save();
		res.send(user);
		console.log(user.togo);
	});
});

// Add Item to "Have Gone" List
router.post("/:id/havegones", function(req, res) {
	console.log('Adding item to "have gone" list.');
	console.log(req.body);
	User.findById(req.params.id).then(function(user) {
		var havegone = new HaveGone(req.body);
		havegone.save(function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log('New "have gone" item was added.');
			}
		});
		user.havegone.push(havegone);
		user.save();
		res.send(user);
	});
});

// Delete Have Gone Entry
router.delete("/:id/havegones/:place_id", function(req, res) {
	console.log("Deleting a place.");
	console.log(req.params);
	User.findOneAndUpdate(
		{ _id: req.params.id },
		{ $pull: { havegone: { _id: req.params.place_id } } },
		function(err, user) {
			if(err) {
				console.log(err);
			} else {
				user.save(function(err, user) {
					User.findById(user._id).then(function(user) {
						res.send(user);
					});
				});
			}
		}
	);
	console.log("Place deleted.");
});

// Delete To Go Entry
router.delete("/:id/togos/:place_id", function(req, res) {
	console.log("Deleting a place.");
	console.log(req.params);
	User.findOneAndUpdate(
		{ _id: req.params.id },
		{ $pull: { togo: { _id: req.params.place_id } } },
		function(err, user) {
			if(err) {
				console.log(err);
			} else {
				user.save(function(err, user) {
					User.findById(user._id).then(function(user) {
						res.send(user);
					});
				});
			}
		}
	);
	console.log("Place deleted.");
});


// // Edit entry
// router.put("/:id/entries/:entry_id", function(req, res) {
// 	console.log("Editing an entry.");
// 	User.findOneAndUpdate(
// 		{ _id: req.params.id },
// 		{ $pull: { entries: { _id: req.params.entry_id } } },
// 		function(err, user) {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				user.save(function(user) {
// 					User.findById(user._id).then(function(user) {
// 						res.send(user);
// 					});
// 				});
// 			}
// 		}
// 	);
// 	console.log("Entry updated.");
// })



// // Add entry
// router.post("/:id/places", function(req, res) {
// 	console.log("Adding new place.");
// 	console.log(req.body);
// 	User.findById(req.params.id).then(function(user) {
// 		var place = new Place(req.body);
// 		place.save(function(err) {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				console.log("New place was added.");
// 			}
// 		});
// 		user.places.push(place);
// 		user.save();
// 		res.send(user);
// 	});
// });


module.exports = router;