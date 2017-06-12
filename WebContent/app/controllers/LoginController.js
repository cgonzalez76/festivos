var app = angular.module("festivos.Controllers");

app.controller( "LoginController", 

    function($controller, $timeout, $scope, $rootScope, $location, $sce, $filter, md5, NotifyService, DTOptionsBuilder, DTColumnDefBuilder,tabsFactory, userFactory, storageFactory, authServices) {

		$scope.init = function () {
			$scope.loading = true;

			//Comprobar en cada refresco de pagina si se ha superado el timestamp desde que el usuario se logó. EL tiempo de caducidad está definido en storagefactory
			if ( storageFactory.getLoggedIn() ) {
                if (storageFactory.timeoutLogin() ) {
                    //Aun está dentro del tiempo  timeout permitido desde el login
                    // restauramos datos de sesión
                    userFactory.userData = storageFactory.getUserData();
                    userFactory.stampLoggedIn ( storageFactory.getLoggedIn() );

                    $scope.loading = false;
                    $location.path("/");

                }else{
                    //Pasó el timeout desde el login
                    userFactory.loggedIn = false;
                    $scope.loading = false;
                    $scope.logout();
                }
			}else{
                userFactory.userData = {};
                userFactory.userData.token = null;
				userFactory.loggedIn = false;
                $scope.loading = false;

            }
	
		};

		$scope.login = function (valid) {

			if (valid) {
				userFactory.userData = {};
				userFactory.userData.token = null;

			  $scope.loading = true;

              $scope.passwordMD5  = $scope.password && $scope.password.length > 0 ? md5.createHash ($scope.password) : $scope.password;

              $scope._spinner.onSpinner = true;
              $scope._spinner.message = "Iniciando sesión. Espere, por favor";
			  authServices.login ($scope.username, $scope.passwordMD5, 

						function(res, status) {
	              			$scope._spinner.onSpinner = false;
				  
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
								$location.path("/");

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
            $scope._spinner.onSpinner = true;
            $scope._spinner.message = "Cerrando sesión. Espere, por favor";

			authServices.logout(userFactory.userData.username,  function(){
	              $scope._spinner.onSpinner = true;

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