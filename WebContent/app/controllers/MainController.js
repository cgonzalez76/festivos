var app = angular.module("festivos.Controllers", []);

app.controller("MainController", 


	function ($scope, $rootScope, $q, $location, $filter, userFactory, storageFactory) {
		userFactory.userData=storageFactory.getUserData();
		userFactory.loggedIn=storageFactory.getLoggedIn();
		$scope.userData = userFactory.userData;
        $scope.loggedIn = userFactory.loggedIn;

    	// ####################################################################################################################################################
    	// ### WATCHERS #######################################################################################################################################
    	// ####################################################################################################################################################

    		$scope.$watch (
    				function () {
    					return userFactory.loggedIn;
    				},
    				function (newValue, oldValue) {
                        //apertura normal tras login
                        $scope.loggedIn = userFactory.loggedIn;
    				}
    		);
    		
    		$scope.$watch (
    				function () {
    					return userFactory.userData;
    				},
    				function (newValue, oldValue) {
    					$scope.userData = newValue;	
    					console.log ($scope.userData.username);
    				}
    		);
    		
   		
    	
        
    	// ####################################################################################################################################################
    	// ### OTHERS #########################################################################################################################################
    	// ####################################################################################################################################################
    		
    		
    		
    		/***********************  SESSION CONTROL  *********************
            Function redefine and overwrite app.run inictial
            Needed for refresh session on every click on BODY
            Check timestamp from user login  in every click on BODY
            EXPIRATION TIME defines in StorageFactory.js
            Además, en LoginController.js se eliminan todos los modales
            POr si hubiese alguno en ejecución qu eno quede superpuesto al formulario login
    	    ****************************************************************/
    	    $rootScope.refreshActiveSession = function($event){
    	
    	        if ( storageFactory.getLoggedIn() ) {
    	            if (!storageFactory.timeoutLogin() ) {
    	                //$event.originalEvent.prevent=true;
    	                $event.stopImmediatePropagation();
    	                $event.stopPropagation();
    	                $event.preventDefault();
    	                $event.cancelBubble = true;
    	                $event.returnValue = false;
    	
    	                //Pasó el timeout desde el login
    	                userFactory.clearUser ();
    	                tabsFactory.clearTabs ();
    	                $location.path("/");
    	                return false;
    	            }
    	        }
    	    };

	}


);