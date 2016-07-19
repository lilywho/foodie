// ----------------------------------------
// Without Auth
// ----------------------------------------
// Application
var App = React.createClass({
	getInitialState: function() {
		var findCookie; // checking for cookie
		if(document.cookie) {
			findCookie = true;
		} else {
			findCookie = "";
		}
		return {
			id: "",
			user: findCookie
		}
		console.log("17: ", findCookie);
	},
	deleteCookie: function() {
		Cookies.remove("jwt_token"); // delete cookie, require authorization again
		this.setState({
			user: "",
		});
		console.log("Logged out.");
	},
	logIn: function(id) { // when login is submitted
		this.setState({
			id: id,
			user: true // keeps user logged in when user === true
		});
	},
	render: function() {
		console.log("Logged in: ", this.state.user)
		if(this.state.user === true) {
			return (
				<Page
					id={this.state.id}
					deleteCookie={this.deleteCookie}
				/>
			);
		} else {
			return (
				<Auth
					logIn={this.logIn}
					logInCheck={this.state.user}
					// onChange={this.logIn}
				/>
			);
		}
	}
});

var Auth = React.createClass({
	getInitialState: function() {
		var logInForm;
		return {
			logInForm: true
		};
	},
	renderLogInForm: function() {
		console.log("Log In");
		this.setState({
			logInForm: true
		})
	},
	renderSignUpForm: function() {
		console.log("Sign Up");
		this.setState({
			logInForm: false
		})
	},
	render: function() {
		if(this.state.logInForm === true) {
			return (
				<div id="auth-container">
					<Tabs
						renderLogInForm={this.renderLogInForm}
						renderSignUpForm={this.renderSignUpForm}
					/>					
					<LogInForm
						logInCheck={this.props.logInCheck}
						onChange={this.props.logIn}
					/>
				</div>
			);
		} else {
			return (
				<div id="auth-container">
					<Tabs
						renderLogInForm={this.renderLogInForm}
						renderSignUpForm={this.renderSignUpForm}						
					/>					
					<SignUpForm onChange={this.props.logIn} />
				</div>
			);
		}
	}
});

var Tabs = React.createClass({
	render: function() {
		return (
			<div id="tabs">
				<div
					className="tabs"
					id="login-tab"
					onClick={this.props.renderLogInForm}
				>
					Log In
				</div>
				<div
					className="tabs"
					id="signup-tab"
					onClick={this.props.renderSignUpForm}
				>
					Sign Up
				</div>
			</div>
		)
	}
});


// var FormDisplay = React.createClass({
// 	render: function() {
// 		return (
// 		)
// 	}
// });

var LogInForm = React.createClass({
	getInitialState: function() {
		return {
			username: this.props.logInCheck, // getting from user
			password: this.props.logInCheck,
			logInStatus: this.props.logInCheck,
			id: ""
		};
	},
	handleLogInFormChange: function(stateName, e) { // input changes are applied
		var change = {};
		change[stateName] = e.target.value;
		this.setState(change);
	},
	handleSubmit: function(e) {
		e.preventDefault(); // sends to proper path
		var username = this.state.username.trim();
		var password = this.state.password.trim();
		this.logInAJAX(username, password); 
	},
	logInAJAX: function(username, password) {
		$.ajax({ // saves user credentials
			url: "/auth",
			method: "POST",
			data: {
				username: username,
				password: password
			},
			success: function(data) {
				console.log("160: ", data)
				console.log("User is logged in.")
				Cookies.set("jwt_token", data.token);
				console.log("163: ", this);
				console.log("164: ", data.id)
				this.props.onChange(data.id); // user set equal to true, id set equal to data.id
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(status, err.toString());
			}.bind(this)
		});
	},
	render: function() {
		return (
			<div className="login-form">
			<h2>Hello.</h2>
				<form onSubmit={this.handleSubmit}>
					<input
						className="username-input form-control"
						onChange={this.handleLogInFormChange.bind(this, "username")} // bind so "this" is inputted data
					  placeholder="Username"
					  type="text"
					  value={this.state.username}
					 />
					<br />
					<input
						className="password-input form-control"
						onChange={this.handleLogInFormChange.bind(this, "password")} // bind so "this" is inputted data
					  placeholder="Password"
					  type="password"
					  value={this.state.password}
					 />
					<br />
					<input
						className="btn btn-info"
						type="submit" />
				</form>
			</div>
		)
	}
});

var SignUpForm = React.createClass({
	getInitialState: function() {
		return {
			email: "",
			username: "",
			password: ""
		}
	},
	handleSignUpFormChange: function(stateName, e) {
		var change = {};
		change[stateName] = e.target.value;
		this.setState(change);
	},
	handleSubmit: function(e) {
		e.preventDefault();
		var email = this.state.email.trim();
		var username = this.state.username.trim();
		var password = this.state.password.trim();
		console.log("SignUpForm.handleSubmit: ", email, username, password);
		this.signUpAJAX(email, username, password); 
	},
	handleAutoLogIn: function(username, password) {
		console.log('--------------------------------------')
		console.log("SignUpForm.handleAutoLogIn.");
		console.log("username", username)
		console.log("password", password)
		var self = this;
		var callback = function(id) {
			self.props.onChange(id);
		}
		$.ajax({
			url: "/auth",
			method: "POST",
			data: {
				username: username,
				password: password
			},
			success: function(data) {
				console.log("User is logged in.")
				Cookies.set("jwt_token", data.token);
				console.log("236: ", data.id);
				this.props.onChange(data.id)
				this.props.onChange(data.id)
				callback(data.id)
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(status, err.toString());
			}.bind(this)
		});
	},
	signUpAJAX: function(email, username, password) {
		$.ajax({
			url: "/users",
			method: "POST",
			data: {
				email: email,
				username: username,
				password: password
			},
			success: function(data) {
				console.log('--------------------------------------')
				console.log("SignUpForm.signUpAJAX success. data: ", data);
				this.handleAutoLogIn(username, password);
			}.bind(this)
		});
	},
	render: function() {
		return (
			<div className="signup-form">
				<h2>Welcome.</h2>
				<form onSubmit={this.handleSubmit}>
					<input
						className="email-input form-control"
						onChange={this.handleSignUpFormChange.bind(this, "email")}
						placeholder="Email"
						type="text"
						value ={this.state.email}
					 />
					<br />
					<input
						className="username-input form-control"
						onChange={this.handleSignUpFormChange.bind(this, "username")}
						placeholder="Username"
						type="text"
						value={this.state.username}		
					 />
					<br />
					<input
						className="password-input form-control"
						onChange={this.handleSignUpFormChange.bind(this, "password")}
						placeholder="Password"
						type='text'
						value={this.state.password}
					 />
					<br />
					<input
						className="btn btn-info"
						type="submit" />
				</form>
			</div>
		);
	}
});

// ----------------------------------------
// With Auth
// ----------------------------------------
var Page = React.createClass({
	getInitialState: function() {
		return (
			{
				toGos: [],
				haveGones: [],
				name: ""	
			}
		);
	},
	// addHaveGone: function(id, place) {
	// 	$.ajax({
	// 		url: "/users/" + id + "/havegones",
	// 		method: "POST",
	// 		data: {name: place},
	// 		success: function(data) {
	// 			this.getHaveGones();
	// 		}.bind(this)
	// 	});
	// },
	// addToGo: function(id, place) {
	// 	setState({name: place});
	// 	console.log("Sending POST to go.");
	// 	console.log(place);
	// 	$.ajax({
	// 		url: "/users/" + id + "/togos",
	// 		method: "POST",
	// 		data: {name: place},
	// 		success: function(data) {
	// 			this.getToGos();
	// 		}.bind(this)
	// 	});
	// },
	componentDidMount: function() {
		this.getHaveGones(this.props.id);
		this.getToGos(this.props.id);
	},
	getHaveGones: function(id) {
		$.ajax({
			url: "users/" + id + "/havegones",
			method: "GET",
			success: function(data) {
				console.log("-----------------------------------")
				console.log("in Page.getHaveGones AJAX")
				console.log(data);
				this.setState({haveGones: data});
			}.bind(this)
		});
	},
	getToGos: function(id) {
		// console.log('in getToGos');
		// console.log(id);
		// console.log(this.props.id);
		$.ajax({
			url: "users/" + id + "/togos",
			method: "GET",
			success: function(data) {
				// console.log('in Page.getToGos');
				// console.log(data);
				// console.log('------------')
				this.setState({toGos: data});
			}.bind(this)
		})
	},
	render: function() {
		return (		
			<div id="page">
				<LogOutButton deleteCookie={this.props.deleteCookie} />
				<Yelp
					id={this.props.id}
					addHaveGone={this.addHaveGone}
					addToGo={this.addToGo}
					place={this.state.place}
					getToGos={this.getToGos}
					getHaveGones={this.getHaveGones} /> 
				<List
					id={this.props.id}
					toGos={this.state.toGos}
					haveGones={this.state.haveGones}
					addHaveGone={this.addHaveGone}
					addToGo={this.addToGo}
					getToGos={this.getToGos}
					getHaveGones={this.getHaveGones}
				/> 
			</div>
		)
	}
});

var LogOutButton = React.createClass({
	handleLogOut: function() {
		console.log("491: ", this);
		this.props.deleteCookie();
	},
	render: function() {
		return (
			<div id="log-out">
				<button
					className="btn btn-info"
					onClick={this.handleLogOut}>
					Log Out
				</button>
			</div>
		)
	}
});

var Yelp = React.createClass({
	getInitialState: function() {
		return (
			{currentSearch: null}
		)
	},
	getResults: function(term, location, limit) {
		console.log("Clicked.");
		$.ajax({
			url: "users/places/" + term + "/" + location + "/" + limit,
			// url: "/users/places",
			method: "GET",
			success: function(data) {
				console.log(data.businesses);
				this.setState({currentSearch: data.businesses});
			// }
			}.bind(this)
		});
	},
	render: function() {
		return (
			<div id="yelp" className="main">
				<Search 
					currentSearch={this.state.currentSearch}
					getResults={this.getResults}
				/>
				<SearchResults
					id={this.props.id}
					place={this.props.place}
					addHaveGone={this.props.addHaveGone}
					addToGo={this.props.addToGo}
					currentSearch={this.state.currentSearch}
					getResults={this.getResults}
					getToGos={this.props.getToGos}
					getHaveGones={this.props.getHaveGones}
				/>
			</div>
		);
	}
});

var Search = React.createClass({
	getInitialState: function() {
		return {
			term: "",
			location: "",
			limit: "",
		}
	},
	handleTermSelection: function(e) {
		e.preventDefault();
		// console.log(e.target.value);
		this.setState({term: e.target.value});
	},
	// handleBarSelection: function(e) { // handleTermSelection takes care of it all
	// 	e.preventDefault();
	// 	this.setState({term: "bars"})
	// 	console.log("Bars."); 
	// },
	// handleRestaurantSelection: function(e) {
	// 	e.preventDefault();
	// 	this.setState({term: "restaurants"})
	// 	console.log("Restaurants.");
	// },
	handleLocationChange: function(e) {
		// console.log(e.target.value);
		this.setState({
			location: e.target.value
		});
	},
	handleLimitChange: function(e) {
		// console.log(e.target.value);
		this.setState({
			limit: e.target.value
		});
	},
	handleSearch: function(e) {
		e.preventDefault();
		var term = this.state.term
		var location = this.state.location.trim();
		var limit = this.state.limit.trim();
		// console.log(term, location, limit);
		this.props.getResults(term, location, limit);
		this.setState({
			term: "",
			location: "",
			limit: ""
		});
	},
	render: function() {
		return (
			// <div id="search" onSubmit={this.handleSearch}>
			<form
				onSubmit={this.handleSearch}
				id="search-form"
				>
				<button
					className="term-options btn btn-primary"
					onClick={this.handleTermSelection}
					value="bars">Bars</button>
				<button
					className="term-options btn btn-primary"
					onClick={this.handleTermSelection}
					value="restaurants">Restaurants</button>
				<button
					className="term-options btn btn-primary"
					onClick={this.handleTermSelection}
					value="coffeeshops">Coffeeshops</button><br />
				<input
					className="location-input form-control"  
					onChange={this.handleLocationChange}
					placeholder="Near..."
					type="text"
					value={this.state.location}
				/><br />
				<input
					className="number-input form-control"  
					onChange={this.handleLimitChange}
					placeholder="Results (25 MAX)"
					type="number"
					max="26"
					value={this.state.limit}
				/><br />
				<button className="btn btn-info">Search</button>
			</form>
			// </div>
		);
	}
});

var SearchResults = React.createClass({
	getInitialState: function() {
		return {
			name: null
		}
	},
	addToGo: function(id, place) {
		// console.log("Sending POST to go.");
		$.ajax({
			url: "/users/" + id + "/togos",
			method: "POST",
			data: {name: place},
			success: function(data) {
				// console.log('in SearchResults.addToGo success');
				this.props.getToGos(id);
			}.bind(this)
		});
	},
	addHaveGone: function(id, place) {
		// console.log("Sending POST have gone.");
		$.ajax({
			url: "/users/" + id + "/havegones",
			method: "POST",
			data: {name: place},
			success: function(data) {
				// console.log('in SearchResults.addHaveGone success');
				this.props.getHaveGones(id);
			}.bind(this)
		});
	},
	render: function() {
		var currentSearch = this.props.currentSearch;
		if (currentSearch == null) {
			return (
				<div id="search-default">
					<p>Find a place to go...</p>
				</div>
			)
		} else {
			// console.log(typeof this.state.currentSearch);
			// console.log(this.state.currentSearch[0].name)
			// console.log(this.props.currentSearch.categories)
			var self = this;
			var newToGo = function(e) {
				// console.log('in SearchResults.render/newToGo')
				var id = self.props.id;
				// console.log(e.target.value);
				var valName = e.target.getAttribute("value");
				self.setState({name: valName});
				var place = valName;
				// console.log(place);
				self.addToGo(id, place);
			};
			var newHaveGone = function(e) {
				// console.log('in SearchResults.render/newHaveGone')
				var id = self.props.id;
				// console.log(e.target);
				// console.log(e.target.value);
				// console.log(e.target.getAttribute("value"))
				var valName = e.target.getAttribute("value");
				self.setState({name: valName});
				var place = valName;
				// console.log(place);
				self.addHaveGone(id, place);
			};
			var results = this.props.currentSearch.map(function(result) {
				return (
					<div id="search-results">
						<a target="_blank" href={result.url}>{result.name}
						</a><br />
							{result.categories[0][0]}<br />
							{result.rating} stars
						<span
							onClick={newToGo}
							value={result.name}>+</span>
						<span
							onClick={newHaveGone}
							value={result.name}>✓</span>
					</div>
				);
			});
		}
		return (
			<div id="results">{results}</div>
		);
	}
});

var List = React.createClass({
	render: function() {
		return (
			<div id="list" className="main">
				<ToGo
					toGos={this.props.toGos}
					getToGos={this.props.getToGos}
					id={this.props.id}
					addHaveGone={this.props.addHaveGone}
				/>
				<hr/>
				<HaveGone
					haveGones={this.props.haveGones}
					id={this.props.id}
					getHaveGones={this.props.getHaveGones}
					// addHaveGone={this.props.addHaveGone}
				/>
			</div>	
		);
	}
});

var ToGo = React.createClass({
	deleteToGoAJAX: function(e) {

		var id = this.props.id;
		var place_id = e.target.value;		
		console.log("-----------------------------------");
		console.log("Sending ToGo DELETE request.");
		console.log("id", id)
		console.log("place_id", place_id)
		$.ajax({
			url: "/users/" + id + "/togos/" + place_id,
			method: "DELETE",
			success: function() {
				console.log("In DELETE success.");
				this.props.getToGos(id);
			}.bind(this)
		});
	},
	render: function() {
		// console.log('---------------------------');
		// console.log('in ToGo.render');
		// console.log('this.props', this.props);
		var toGos = this.props.toGos;
		var self = this;
		if (toGos.length === 0) {
			return (
				<div id="to-go" className="lists">
					<h4>"Places I Want to Go"</h4>
					<h5>Add somewhere you want to go!</h5>
				</div>
			);
		} else {
			var toGoList = this.props.toGos.map(function(toGo) {
				return (
					<div>
						{toGo.name}
					<button
						onClick={self.deleteToGoAJAX}
						value={toGo._id}
					>
					Delete
					</button>	
					</div>
				);
			});
		}
		return (
			<div id="to-go" className="lists">
			<h4>"Places I Want to Go"</h4>
				{toGoList}
			</div>
		);
	}
});

var HaveGone = React.createClass({
	deleteHaveGoneAJAX: function(id, place_id) {
		// var id = this.props.id;
		// var place_id = e.target.value;
		// console.log("Sending HaveGone DELETE request.");
		$.ajax({
			url: "/users/" + id + "/havegones/" + place_id,
			method: "DELETE",
			success: function() {
				// console.log("In DELETE success.");
				this.props.getHaveGones(id);
			}.bind(this)
		});
	},
	render: function() {
		var self = this;
		// console.log('this.props', this.props);
		var haveGones = this.props.haveGones
		if (haveGones.length === 0) {
			return (
				<div id="have-gone" className="lists">
					<h4>"Places I've Gone"</h4>
					<h5>Add somewhere you've been!</h5>
				</div>
			);
		} else {
			var haveGoneList = this.props.haveGones.map(function(haveGone) {
				//var self = this;
				var deleteHaveGone = function(e) {
					var id = self.props.id;
					var place_id = e.target.value;
					self.deleteHaveGoneAJAX(id, place_id)
				}

				return (
					<div>
						{haveGone.name}
						<button
							onClick={deleteHaveGone}
							value={haveGone._id}
						>
						Delete
						</button>	
					</div>
				);
			});
		}
		return (
			<div id="have-gone" className="lists">
				<h4>"Places I've Gone"</h4>
				{haveGoneList}
			</div>
		);
	}
})


ReactDOM.render(<App />, document.getElementById("master-container"));
