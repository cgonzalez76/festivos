var app = angular.module("festivos.Controllers");

app.controller( "LoginController", 

    function($controller, $timeout, $scope, $rootScope, $location, $sce, $filter, md5, NotifyService, DTOptionsBuilder, DTColumnDefBuilder,tabsFactory, userFactory, storageFactory, authServices) {

		$scope.init = function () {
			$scope.loggedin = false;
	
		};

		$scope.login = function (valid) {

			if (valid) {

			  $scope.loading = true;

              $scope.passwordMD5  = $scope.password && $scope.password.length > 0 ? md5.createHash ($scope.password) : $scope.password;

			  authServices.login ($scope.username, $scope.passwordMD5, 

						function(res, status) {

							if (status == 200 && !angular.isUndefinedOrNull(res) ) {
								userFactory.userData = res;
								userFactory.stampLoggedIn (true)

                                userFactory.userData.timestamplogin = new Date().getTime();

								// almacenamos datos de sesión
								storageFactory.storeUserData ( userFactory.userData );
								storageFactory.storeLoggedIn ( true );
								
								// reset tabs
								tabsFactory.clearTabs ();
								

								$scope.loading = false;
								$location.path("/home");

							} else if ( status == 401 ){
								$scope.error = res.code;
								$scope.errorMsg = res.message;

								userFactory.loggedIn = false;
								$scope.loading = false;

							} else {
								$scope.error = -1;
								$scope.errorMsg = 'No server response or error. Status = ' + (status?status:'?');

								userFactory.loggedIn = false;
								$scope.loading = false;
							}
						});

			}

		}
 

		//
		$scope.logout = function () {

			authServices.logout(userFactory.userData.username,  function(){
	    		$location.path("/");
	    	});
	    	
	    	//
	    	userFactory.clearUser ();
	    	tabsFactory.clearTabs ();
	    	
	    	// limpiamos datos de sesión
	    	storageFactory.resetStorage();
	    }

	}
);