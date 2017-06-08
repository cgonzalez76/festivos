var app = angular.module("festivos.Factories");

app.factory('storageFactory',

	function ($localStorage, $sessionStorage) {

		//
		var service = {};
	
        var tiempoSesionDefault = 15*60; //(15 minutos) Tiempo maximo de caducidad tras login

        var sessionStorage = $sessionStorage.$default({});
		var localStorage = $localStorage.$default({});
		
		var userLocalStorageID = '';

        service.externalReport = '';

		// ## SESSION STORAGE ##################################

        service.timeoutLogin = function(){
            var timestampLogin = sessionStorage.userData.timestamplogin;
            var timestampNow = new Date().getTime();
            var tiempoSesion =  tiempoSesionDefault;

            if(typeof timestampLogin !== 'undefined' && timestampLogin != null && !isNaN(timestampLogin)){

                if(timestampNow - timestampLogin < tiempoSesion * 1000){
                    sessionStorage.userData.timestamplogin = timestampNow; //renovamos la sesion
                    return true;
                }else{
                    return false;
                }

            }else{
                return false;
            }

        };

		service.storeLoggedIn = function (loggedIn) {
			sessionStorage.loggedIn = loggedIn;
		}
		
		service.getLoggedIn = function () {
			return sessionStorage.loggedIn;
		}


		service.storeUserData = function (data) {
			sessionStorage.userData = data;
		};
		
		service.getUserData = function () {
			return sessionStorage.userData;
		};
		
		
		service.storeTabs = function (tablist) {
			sessionStorage.tablist = tablist;
		}

		service.getTabs = function () {
			return sessionStorage.tablist;
		}

		service.resetSessionStorage = function () {
			sessionStorage.$reset();
		}


		// ## LOCAL STORAGE ##################################

		service.resetLocalStorage = function () {
			localStorage.$reset();
		}



		// ## COMMON ##################################

		service.resetStorage = function () {
			service.resetSessionStorage();
			service.resetLocalStorage();
		}


        // ## TEMPORAL COPY SESSION IN LOCAL  ##################################

        service.tmpSession2Local = function () {
             var sessionTmpName='sessiontmp';
             var sessionTMP = {};

            sessionTMP.loggedIn = service.getLoggedIn();

            //reset cronómetro session en user data
            sessionStorage.userData.timestamplogin = new Date().getTime();
            sessionTMP.userData = service.getUserData();

            localStorage[sessionTmpName] = sessionTMP;

        }

        service.resetTmpSession2Local = function (sessionTmpName) {
            delete localStorage[sessionTmpName];
        }

		return service;

	}

);
