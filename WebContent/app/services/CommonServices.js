var app = angular.module('festivos.Services', ['ngCookies']);

//app.value('ENDPOINT', 'http://asuranceturisk.no-ip.org/festivos/ws');
app.value('ENDPOINT', 'http://localhost:8080/festivos/ws');

app.service('commonServices',
    function(ENDPOINT, $http, userFactory) {

		//
		this.getEndpointURL = function() {
			return ENDPOINT;
		};


		//
		this.httpGet = function (service, params, callback) {

			// componemos url del servicio
			var url = this.getEndpointURL() + service;


			// ejecutando llamada
			$http.get (url, {
				params: params,
				headers: {
				    'Content-Type': 'application/json',
				    'token': angular.isObject(userFactory.userData) ? userFactory.userData.token : null,
//				    'locale': l10nFactory.locale.code
				}
			})
			.success(function(response, status, headers, config, statusText) {
				callback(response, status);
			})
			.error(function(response, status, headers, config, statusText) {
				callback(response, status);
			});

		};


		//
		this.httpPost = function (service, params, callback) {

			// componemos url del servicio
			var url = this.getEndpointURL() + service;
			

			// ejecutando llamada
			$http.post (url, params, {
				headers: {
				    'Content-Type': 'application/json',
				    'token':  angular.isObject(userFactory.userData) ? userFactory.userData.token : null,
//				    'locale': l10nFactory.locale.code
				}
			})
			.success(function(response, status, headers, config, statusText) {
				callback(response, status);
			})
			.error(function(response, status, headers, config, statusText) {
				callback(response, status);
			});

		};

		
		//
		this.httpPostFormData = function (service, formdata, params, callback) {

			// componemos url del servicio
			var url = this.getEndpointURL() + service;


			// ejecutando llamada
			$http.post (url, formdata, {
				headers: {
					'Content-Type': undefined, // obligatorio o no compone bien los boundary
				    'token':  angular.isObject(userFactory.userData) ? userFactory.userData.token : null,
//				    'locale': l10nFactory.locale.code
				},
				params: params
			})
			.success(function(response, status, headers, config, statusText) {
				callback(response, status);
			})
			.error(function(response, status, headers, config, statusText) {
				callback(response, status);
			});

		};
		
		
		//
		this.httpPut = function (service, params, callback) {

			// componemos url del servicio
			var url = this.getEndpointURL() + service;


			// ejecutando llamada
			$http.put (url, params, {
				headers: {
				    'Content-Type': 'application/json',
				    'token':  angular.isObject(userFactory.userData) ? userFactory.userData.token : null,
//				    'locale': l10nFactory.locale.code
				}
			})
			.success(function(response, status, headers, config, statusText) {
				callback(response, status);
			})
			.error(function(response, status, headers, config, statusText) {
				callback(response, status);
			});

		};
		


		//
		this.httpDelete = function (service, params, callback) {

			// componemos url del servicio
			var url = this.getEndpointURL() + service;

			
			// ejecutando llamada
			$http ({
				url: url,
				method: 'DELETE',
				params: params,
				headers: {
				    'Content-Type': 'application/json',
				    'token':  angular.isObject(userFactory.userData) ? userFactory.userData.token : null,
//				    'locale': l10nFactory.locale.code
				}
			})
			.success(function(response, status, headers, config, statusText) {
				callback(response, status);
			})
			.error(function(response, status, headers, config, statusText) {
				callback(response, status);
			});

		};


	}

);
