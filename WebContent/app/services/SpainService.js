var app = angular.module('festivos.Services');

app.service('spainServices',

	function(commonServices) {


        /*
         *
         */
        this.loadCcaa = function(callback) {

        	commonServices.httpGet ('/local/ccaa', {}, callback);

        }

        this.loadProvincias = function(ccaa, callback) {

        	commonServices.httpGet ('/local/ccaa/' + ccaa.ccaa + "/provincias", {}, callback);

        }

		/*
		 * 
		 */
		this.loadFestivos = function(param, callback) {

			commonServices.httpPost ('/local', param, callback);

		}


        /*
         *
         */
        this.getFestivoHoy = function(params, callback) {

            commonServices.httpPost ('/local/ahora', params, callback);

        }


});


