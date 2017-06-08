var app = angular.module('festivos.Services');

app.service('authServices',

	function($http, $cookies, commonServices, userFactory) {

		var auth = {};


		//
		this.login = function(username, password, callback) {

			commonServices.httpGet ('/users/login?username=' + username + '&password=' + password, {}, callback);

		}


		//
		this.logout = function(username, callback) {
			commonServices.httpGet ('/users/logout?username=' + username , {}, callback);
		}


		//
		this.isLoggedIn = function(callback) {
			var loggedIn = $cookies.pnsCookie;
			if (loggedIn == undefined || loggedIn == null) {
				$cookies.pnsCookie = false;
				loggedIn = false;
			}
			callback((loggedIn == "true" || loggedIn == true) ? 200 : 401);
		}

	}

);
