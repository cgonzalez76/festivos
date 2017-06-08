var app = angular.module("festivos.Factories");

app.factory('userFactory',

	function($location) {
	
		var service = {};
	
		// user is logged
		service.loggedIn = false;
	
		// user data
		service.userData = {};
		

	    //
	    service.clearUser = function () {
	    	service.loggedIn = false;
	    	service.userData = {};
	    }


	    //
	    // 
	    service.stampLoggedIn = function (/*Boolean*/ state) {
	    	service.loggedIn = state;

	    //	if ( state )
	    //		licenseFactory.clearToken();
	    }


		return service;

	}

);
