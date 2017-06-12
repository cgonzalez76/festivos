var app = angular.module("festivos.Factories");

app.factory('datesFactory',

	function () {

		var service = {};

		/*
		 * parseMoment
		 */
		service.parseMoment = function (date, offset) {
			
			var m = null;
			
			if ( !angular.isUndefinedOrNull(offset) ) {
				m = moment.utc (date);
				if ( m.isValid())
					m.utcOffset (offset);

			} else
				m = moment (date);
			
			return m;
		}
		

		/*
		 * composeMoment
		 */
		service.composeMoment = function (date, offset) {

			var m = null;

			if ( !angular.isUndefinedOrNull(offset) ) {

				if ( !angular.isUndefinedOrNull (date) )
					m = moment.utc (date);
				else
					m = moment.utc ();

        		m.utcOffset (offset);

			} else if ( !angular.isUndefinedOrNull (date) )
				m = moment (date);

			else
				m = moment ();

			return m;

		}


		/*
		 * isValidMoment
		 */
		service.isValidMoment = function (m) {
			
			if ( angular.isUndefinedOrNull(m) )
				return false;

			return moment.utc(m).isValid(); // return true if m === undefined

		}


		/*
		 * prettyDate
		 */
		service.prettyDate = function (date, format) {
			
			if ( !service.isValidMoment (date) )
				return '';

        	var m = moment (date);
        	
        	if ( angular.isUndefinedOrNull(format) )
        		format = 'DD / MM / YYYY';

        	return m.format(format); // m.toString();
        }
		
		

		/*
		 * getEpoch
		 */
		service.getEpoch = function () {
			return moment().utc().startOf('year').year(1970);
		}



		return service;

	}

);
