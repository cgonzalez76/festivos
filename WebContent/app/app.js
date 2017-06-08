var app = angular.module('festivos', [ 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngStorage', 'ngSanitize',
                                    'datatables', 'datatables.buttons', 'datatables.scroller', //'datatables.bootstrap', 
                                    'ngTable', 'ng-sortable', 'ngFileUpload',
                                    'pascalprecht.translate', 'ngMd5','ui.select','ngSanitize',
                                    'datePicker', 'cgNotify', 'ngScrollable',
                                    'festivos.Controllers', 
                                    'nsPopover', 'ui.bootstrap.contextMenu','chart.js','angular-timezone-selector', 'datatables.colreorder']);

//se han desconectado esto plugins:  'ngScrollable'

app.run (function($rootScope){

    //Initial function for refresh session on FIRST APP RUN
    //In BarsController.js  is redefined overwritten
    $rootScope.refreshActiveSession = function(){
        //console.log('Definicion TEMPORAL INICIAL de funcion SESSION');
    };

	//
	$rootScope.composeUrl = function(url, queryparams) {
		var hasquery = false;
		var hasparams = false;

		if ( url.indexOf ('?') > -1 ) {
		    hasquery = true;

		    if ( url.charAt (url.length -1) != '?' )
		        hasparams = true;

		}

		if ( queryparams === null )
		    queryparams = [];


		var params = '';

		for (var qp in queryparams) {
		    if (queryparams.hasOwnProperty(qp)) {

		        if ( !hasparams )
		            hasparams = true;
		        else
		            params += '&';

		        params += qp + '=' + queryparams[qp];

		    }
		}

		if ( !hasquery && params.length > 0 )
		    params = '?' + params;

		return url + params;
	}


});

app.config([ 
	'$routeProvider',
	'$locationProvider',
	'$translateProvider',
    'ChartJsProvider',
    '$compileProvider',
    '$logProvider',
	function($routeProvider, $locationProvider, $translateProvider, ChartJsProvider, $compileProvider, $logProvider) {

        // disable debug info
        $compileProvider.debugInfoEnabled(false);
        $logProvider.debugEnabled(false);

		//
	    // Configure all charts
        ChartJsProvider.setOptions({
            colours: ['#999c9e', '#2f4050', '#19a0a1', '#94BED9', '#1c84c6', '#d1dade', '#e2f4ff', '#2f4050'],
            responsive: true
        });
        // Configure all line charts
        /*ChartJsProvider.setOptions('bar', {
         datasetFill: true
         });*/
	
		//
		$routeProvider.when('/', {
			templateUrl : 'app/views/home.html',
			controller : 'MainController'
		});
		$routeProvider.when('', {
			templateUrl : 'app/views/home.html',
			controller : 'MainController'
		});
	
	
		$routeProvider.when('/home', {
			templateUrl : 'app/views/home.html',
			controller : 'MainController'
		});
		
		$routeProvider.otherwise({ 
			templateUrl : 'app/views/error.html',
			controller : 'MainController'
			//redirectTo: '/'
		});
	
	
		// use the HTML5 History API
		$locationProvider.html5Mode(true).hashPrefix('!');

	}

]);




// ####################################################################################################################################################
// ### UTILITIES ######################################################################################################################################
// ####################################################################################################################################################

/*
 * 
 */
angular.isUndefinedOrNull = function(val) {
	return angular.isUndefined(val) || val === null;
};

/*
 * 
 */
angular.isValidValue = function (val) {
	return !angular.isUndefinedOrNull(val) && (new String(val).trim()).length > 0; 
}

/*
 * 
 */
angular.isIntegerValue = function (val) {
	return !angular.isUndefinedOrNull(val) 
				? /^[-+]?\d+$/.test(val) 
				: false;
}

/*
 * 
 */
angular.isValidIntegerValue = function (val, min, max) {
	
	return angular.isIntegerValue(val) 
			  && (angular.isIntegerValue(min) ? val >= min : true) 
			  && (angular.isIntegerValue(max) ? val <= max : true); 
}


//####################################################################################################################################################
//### PROTOTYPES #####################################################################################################################################
//####################################################################################################################################################

/*
 * 
 */
String.prototype.padLeft = function (len, c) {
    var s = this, c= c || '0';
    while( s.length < len ) s = c + s;
    return s;
}

/*
 * 
 */
String.prototype.revsubstr = function (pos, len) {
    var s = this;
    s = s.substring (s.length - (pos+len), s.length - pos);
    return s;
}

/*
 * 
 */
String.prototype.hasWhiteSpaces = function () {
	return /\s/.test(this); 
}
