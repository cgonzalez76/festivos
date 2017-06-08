var app = angular.module("festivos.Controllers") ;
app.directive('onlyDigits', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attr, ctrl) {
          function inputValue(val) {
            if (val) {
              var digits = val.replace(/[^0-9]/g, '');

              if (digits !== val) {
                ctrl.$setViewValue(digits);
                ctrl.$render();
              }
              return parseInt(digits,10);
            }
            return undefined;
          }            
          ctrl.$parsers.push(inputValue);
        }
      };
  });
app.directive('wmBlock', function ($parse) {
    return {
        scope: {
          wmBlockLength: '='
        },
        link: function (scope, elm, attrs) {
         
          elm.bind('keypress', function(e){
           
            if(elm[0].value.length > scope.wmBlockLength -1){
              e.preventDefault();
              return false;
            }
          });
        }
    }   
});

app.controller( "spainController", 

    function($controller, $timeout, $scope, $rootScope, $location, $sce, $filter, md5, NotifyService, DTOptionsBuilder, DTColumnDefBuilder, adminServices, spainServices,tabsFactory) {

	$scope.comboCCAA = [];
	$scope.comboProvincias = [];
	$scope.ccaaSeleccionada;
	$scope.provinciaSeleccionada;
	$scope.festivoHoy = {festivo:"False",
						 ccaa:null,
						 provincia:null,
						 cp:null,
						 telefono:null,
						 nombre:null,
						 tipo:null};


	$scope.peticion = {	ccaa:null,
						provincia:null,
						telefono:null,
						cp:null};
	
	$scope.respuesta = [{
			fecha:null,
			dia:null,
			nombre: null,
			tipo:null
			}];
	
    $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withOption("aaSorting", [])
    .withOption('responsive', true)
    .withOption('bAutoWidth', true)
    .withOption('stateSave', true)
    .withOption('processing', false)
	.withPaginationType('full_numbers')
	.withOption('iDisplayLength', 25)
    .withDOM('Zlfrtip')
    

    $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef([0])
                          .withOption('type', 'date')
    ];

	$scope.initializeSpain = function () {
		
		spainServices.loadCcaa(function (res, status) {

			if ( status == 200 ) 
				// cargamos datos
				$scope.comboCCAA = res;

			else if ( status == 204 )
				$scope.comboCCAA = [];

			else {
				var msg = res && res.message ? res.message : $filter('translate')('general.errorLoadingData');
				NotifyService.several ( msg, tabsFactory.maintab );
			}

		});
	}
	
	$scope.getProvincias = function (ccaa) {
		spainServices.loadProvincias (ccaa, function (res,status) {
			if ( status == 200 ) 
				// cargamos datos
				$scope.comboProvincias = res;

			else if ( status == 204 )
				$scope.comboProvincias = [];

			else {
				var msg = res && res.message ? res.message : $filter('translate')('general.errorLoadingData');
				NotifyService.several ( msg, tabsFactory.maintab );
			}

		});
	
	}

	$scope.getFestivos = function () {
		
		if (("" + $scope.peticion.cp).length > 0)
			$scope.peticion.cp = pad ($scope.peticion.cp,5);
		if ($scope.peticion.ccaa != null)
				$scope.peticion.ccaa = $scope.peticion.ccaa.ccaa;
		if ($scope.peticion.provincia != null)
			$scope.peticion.provincia = $scope.peticion.provincia.provincia
		spainServices.loadFestivos ($scope.peticion, function (res,status) {
			if ( status == 200 ) 
				// cargamos datos
				$scope.respuesta = res;

			else if ( status == 204 )
				$scope.respuesta = [];

			else {
				$scope.respuesta = [];
				var msg = res && res.message ? res.message : $filter('translate')('general.errorLoadingData');
				
				NotifyService.several ( msg, tabsFactory.maintab );
			}

		});
	
		spainServices.getFestivoHoy ($scope.peticion, function (res, status){
				if ( status == 200 ) { 
					// cargamos datos
					$scope.festivoHoy = res;
					
					if (res.festivo == "True") {
						$scope.festivoHoy.texto = "Hoy es " + $scope.festivoHoy.nombre + ". Festivo de tipo " + $scope.festivoHoy.tipo + ". ";
						if ($scope.festivoHoy.ccaa != 'null'){
							$scope.festivoHoy.texto += " en " + $scope.festivoHoy.ccaa;
						} else {
							$scope.festivoHoy.texto += " en " + $scope.festivoHoy.provincia;
						}
							
					};
		
				}else if ( status == 204 ){
					$scope.festivoHoy = [];
	
				}else {
					var msg = res && res.message ? res.message : $filter('translate')('general.errorLoadingData');
					NotifyService.several ( msg, tabsFactory.maintab );
				}
			});
	}
	
    $scope.formatDate = function (date) {
    	var dateSplit = date.split("-");
    	var dateOut = new Date(dateSplit[2], dateSplit[1], dateSplit[0]);
        dateOut.setMonth(dateOut.getMonth() - 1);
        return dateOut;
    };

    function pad (n, length) {
        if (n != null ){
           	var  n = n.toString();
	        while(n.length < length)
	             n = "0" + n;
        } else {
        	n="";
        }
	    return n;
    };


	$scope.$watch (
			function () {
				return $scope.peticion.ccaa;
			},
			function (newValue, oldValue) {
				if (newValue != null) 
					$scope.getProvincias(newValue);	
			}
		);

	}

);