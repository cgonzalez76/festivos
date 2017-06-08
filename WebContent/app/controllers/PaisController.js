var app = angular.module("festivos.Controllers");

app.controller( "paisController", 

    function($controller, $timeout, $scope, $rootScope, $location, $sce, $filter, md5, NotifyService, DTOptionsBuilder, DTColumnDefBuilder,paisServices,tabsFactory) {

	$scope.comboPaises = [];
	$scope.paisSeleccionado;
	$scope.festivoHoy = {festivo:"False",
						 nombre:null,
						 tipo:null,
						 observaciones:null};


	$scope.peticion = {pais:null,
						ccaa:null,
						provincia:null,
						telefono:null,
						cp:null};
	
	$scope.respuesta = [{
			fecha:null,
			dia:null,
			nombre: null,
			tipo:null,
			observaciones:null
	}];
	
    $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withOption("aaSorting", [])
    .withOption('responsive', true)
    .withOption('bAutoWidth', true)
    .withOption('stateSave', true)
    .withOption('processing', false)
	.withPaginationType('full_numbers')
    .withDOM('Zlfrtip')

    $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef([0])
                          .withOption('type', 'date')
    ];

	$scope.initializePais = function () {
		
		paisServices.loadPaises(function (res, status) {

			if ( status == 200 ) 
				// cargamos datos
				$scope.comboPaises = res;

			else if ( status == 204 )
				$scope.comboPaises = [];

			else {
				var msg = res && res.message ? res.message : $filter('translate')('general.errorLoadingData');
				NotifyService.several ( msg, tabsFactory.maintab );
			}

		});
	}
	
	$scope.getFestivos = function (pais) {
		paisServices.loadFestivos (pais, function (res,status) {
			if ( status == 200 ) 
				// cargamos datos
				$scope.respuesta = res;

			else if ( status == 204 )
				$scope.respuesta = [];

			else {
				var msg = res && res.message ? res.message : $filter('translate')('general.errorLoadingData');
				NotifyService.several ( msg, tabsFactory.maintab );
			}

		});
		
		paisServices.getFestivoHoy (pais, function (res, status){
			if ( status == 200 ) { 
				// cargamos datos
				$scope.festivoHoy = res;
				
				if (res.festivo == "True") {
					$scope.festivoHoy.texto = "Hoy es " + $scope.festivoHoy.nombre + ". Festivo de tipo " + $scope.festivoHoy.tipo + ". Observaciones: ";
					if ($scope.festivoHoy.observaciones != 'null')
						$scope.festivoHoy.texto += $scope.festivoHoy.observaciones;
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


	$scope.$watch (
			function () {
				return $scope.paisSeleccionado;
			},
			function (newValue, oldValue) {
				if (newValue != null) 
					$scope.getFestivos(newValue);	
			}
		);
	

	}

);