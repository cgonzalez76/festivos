var app = angular.module('festivos.Services');

app.service('logServices',

	function(commonServices) {


		
		/*
		 * FUNCIONALITIES *
		 */
		this.loadLogEntries = function(days,callback) {

			commonServices.httpGet ('/log?days=' + days, {}, callback);

		}
});


