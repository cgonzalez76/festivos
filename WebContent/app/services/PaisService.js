var app = angular.module('festivos.Services');

app.service('paisServices',

	function(commonServices) {


        /*
         *
         */
        this.loadPaises = function(callback) {

        	commonServices.httpGet ('/paises/disponibles', {}, callback);

        }
		
		/*
		 * 
		 */
		this.loadFestivos = function(param, callback) {

			commonServices.httpPost ('/pais', param, callback);

		}


        /*
         *
         */
        this.getFestivoHoy = function(params, callback) {

            commonServices.httpPost ('/pais/ahora', params, callback);

        }


});


