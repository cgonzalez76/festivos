var app = angular.module("festivos.Controllers");

app.controller( "paisController", 

    function($controller, $timeout, $scope, $rootScope, $location, $sce, $filter, md5, NotifyService, DTOptionsBuilder, DTColumnDefBuilder,paisServices,tabsFactory, datesFactory) {

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

	$scope.monthpicker =  {
        	dt: null
        }

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
	
	$scope.contactEvents=[];
	$scope.currentRecord={};

    
	$scope.initializePais = function () {
		$scope._spinner.onSpinner = true;
		$scope._spinner.message = "Recuperando lista de paises. Espere, por favor";

		paisServices.loadPaises(function (res, status) {
			$scope._spinner.onSpinner = false;

			if ( status == 200 ) 
				// cargamos datos
				$scope.comboPaises = res;

			else if ( status == 204 )
				$scope.comboPaises = [];

			else {
				var msg = res && res.message ? res.message : "Error cargando datos";
				NotifyService.several ( msg, tabsFactory.maintab );
			}

		});
        fullCalendarInitialize();

	}
	
	$scope.getFestivos = function (pais) {
		$scope.contactEvents = [];
		$scope._spinner.onSpinner = true;
		$scope._spinner.message = "Recuperando festivos. Espere, por favor";

		paisServices.loadFestivos (pais, function (res,status) {
			if ( status == 200 ) {
				$scope._spinner.onSpinner = false;
				for (var x=0; x < res.listafestivos.length; x++) {
					var momento = moment(res.listafestivos[x].fecha,'DD/MM/YYYY');
					res.listafestivos[x].moment = momento;
					res.listafestivos[x].idcalendar = x;
					$scope.contactEvents=$scope.contactEvents.concat ({"start":momento, "title": res.listafestivos[x].tipo + "\r\n" + res.listafestivos[x].nombre, "color":"#f00", allDay:true, id:x});
				}

				$('#calendar').fullCalendar( 'removeEventSources'  )
				$('#calendar').fullCalendar( 'addEventSource', $scope.contactEvents  )
				$scope.respuesta = res;
				console.log (res);

			} else if ( status == 204 ) {
				$scope.respuesta = [];

			} else {
				var msg = res && res.message ? res.message : "Error cargando datos";
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
				} else {
					$scope.festivoHoy.texto = "Hoy no es festivo en el pais seleccionado. ";
				};

			}else if ( status == 204 ){
				$scope.festivoHoy = [];

			}else {
				var msg = res && res.message ? res.message : "Error cargando datos";
				NotifyService.several ( msg, tabsFactory.maintab );
			}
		});
	}
	

	/*
	 * fullCalendarIntialize
	 */
	var fullCalendarInitialize = function () {

		// prepare calendar
		$('#calendar').fullCalendar( 'destroy'); //removeEvents
		$('#calendar').fullCalendar({
			theme: true,
/*			customButtons: {
				select_month: {
		            text: 'Selecciona un mes',
		            click: function() {

		            	var btn = $('button[class~=fc-select_month-button]');
			            	$('#monthPickerContainer').offset ({
			            		left: btn.offset().left - 50,
			            		top: btn.offset().top - 25
			            	});

			            	$('#dtmonthpicker2').select();
		                   
		            }
		        }
		    },*/

			header: {
				left: 'title',
				right: 'select_month prev,next'
			},
			lang: 'es',
			aspectRatio: 2,
			firstDay: 1,
			editable: false,
 			events: $scope.contactEvents,
 			eventLimit: 3,
 			defaultView: 'month',
			selectable: true,
			eventClick: function( event, jsEvent, view ) {
				$scope.currentRecord={};
				for (i=0;i<$scope.respuesta.listafestivos.length;i++){
					if ($scope.respuesta.listafestivos[i].idcalendar == event.id){
			         	$timeout (function () {
							$scope.currentRecord = $scope.respuesta.listafestivos[i];
			         	}, 0);
						break;
					}
				}

				console.log ($scope.currentRecord);
				$('#festivoModal').modal('show');

 			},
 			

			viewRender: function( view, element ) {
				//
				$scope.monthpicker.dt = $('#calendar').fullCalendar('getDate').toDate();
			},
			
			selectAllow: function( selectInfo ) {
				console.log (selectInfo );
				return false;
			}

		});

	}

	
	$scope.formatDate = function (date) {
    	var dateSplit = date.split("-");
    	var dateOut = new Date(dateSplit[2], dateSplit[1], dateSplit[0]);
        dateOut.setMonth(dateOut.getMonth() - 1);
        return dateOut;
    };

    $scope.$watch('monthpicker.dt', function(newValue, oldValue) {
    	var _new = datesFactory.composeMoment (newValue);
    	var _old = datesFactory.composeMoment (oldValue);

    	if ( _new.month() != _old.month() || _new.format('YYYYMM') == _old.format('YYYYMM')) {
    		$(':focus').blur();

    		var curr = $('#calendar').fullCalendar('getDate');

    		if ( moment.isMoment(curr) && _new.format('YYYYMM') != curr.format('YYYYMM') )
    			$('#calendar').fullCalendar('gotoDate', _new); 

    	}

    });

    $scope.$watch('monthpicker.dt', function(newValue, oldValue) {
    	var _new = datesFactory.composeMoment (newValue);
    	var _old = datesFactory.composeMoment (oldValue);

    	if ( _new.month() != _old.month() || _new.format('YYYYMM') == _old.format('YYYYMM')) {
    		$(':focus').blur();

    		var curr = $('#calendar').fullCalendar('getDate');

    		if ( moment.isMoment(curr) && _new.format('YYYYMM') != curr.format('YYYYMM') )
    			$('#calendar').fullCalendar('gotoDate', _new); 

    	}

    });

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