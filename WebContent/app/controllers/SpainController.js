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

    function($controller, $timeout, $scope, $rootScope, $location, $sce, $filter, md5, NotifyService, DTOptionsBuilder, DTColumnDefBuilder,spainServices,tabsFactory) {

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
	.withOption('iDisplayLength', 25)
    .withDOM('Zlfrtip')
    

    $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef([0])
                          .withOption('type', 'date')
    ];

	$scope.spainEvents=[];
	$scope.currentRecord={};

	$scope.initializeSpain = function () {
		$scope._spinner.onSpinner = true;
		$scope._spinner.message = "Recuperando lista de Comunidades. Espere, por favor";

		spainServices.loadCcaa(function (res, status) {
			$scope._spinner.onSpinner = false;
			
			if ( status == 200 ) 
				// cargamos datos
				$scope.comboCCAA = res;

			else if ( status == 204 )
				$scope.comboCCAA = [];

			else {
				var msg = res && res.message ? res.message : "Error recuperando datos";
				NotifyService.several ( msg, tabsFactory.maintab );
			}

		});
        fullCalendarInitialize();

	}
	
	$scope.getProvincias = function (ccaa) {
		$scope._spinner.onSpinner = true;
		$scope._spinner.message = "Recuperando lista de Provincias. Espere, por favor";

		spainServices.loadProvincias (ccaa, function (res,status) {
			$scope._spinner.onSpinner = false;
			if ( status == 200 ) 
				// cargamos datos
				$scope.comboProvincias = res;

			else if ( status == 204 )
				$scope.comboProvincias = [];

			else {
				var msg = res && res.message ? res.message : "Error recuperando datos";
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

		$scope._spinner.onSpinner = true;
		$scope._spinner.message = "Recuperando festivos. Espere, por favor";

		spainServices.loadFestivos ($scope.peticion, function (res,status) {
			$scope._spinner.onSpinner = false;
			
			if ( status == 200 ) {
				$scope.spainEvents=[];
			

				for (var x=0; x < res.listafestivos.length; x++) {
					var momento = moment(res.listafestivos[x].fecha,'DD/MM/YYYY');
					res.listafestivos[x].moment = momento;
					res.listafestivos[x].idcalendar = x;
					$scope.spainEvents=$scope.spainEvents.concat ({"start":momento, "title": res.listafestivos[x].tipo + "\r\n" + res.listafestivos[x].nombre, "color":"#f00", allDay:true, id:x});
				}
				$scope.respuesta = res;

	     		$timeout (function () {
					console.log ($scope.spainEvents.length);
					$('#calendarspain').fullCalendar( 'removeEventSources'  );
					$('#calendarspain').fullCalendar( 'addEventSource', $scope.spainEvents  );
					$('#calendarspain').fullCalendar('render');
	
	         	}, 100);

			}else if ( status == 204 ){
				$scope.respuesta = [];

			}else {
				$scope.respuesta = [];
				var msg = res && res.message ? res.message : "Error recuperando datos";
				
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
							
					} else {
						$scope.festivoHoy.texto = "Hoy no es festivo en dicha localidad ";
						
					};
		
				}else if ( status == 204 ){
					$scope.festivoHoy = [];
	
				}else {
					var msg = res && res.message ? res.message : "Error recuperando datos";
					NotifyService.several ( msg, tabsFactory.maintab );
				}
			});
	}
	
	$scope.renderCal = function () {
		$('#calendarspain').fullCalendar( 'removeEventSources'  );
		$('#calendarspain').fullCalendar( 'addEventSource', $scope.spainEvents  );
		$('#calendarspain').fullCalendar('render');
		return true;
	};
    $scope.formatDate = function (date) {
    	var dateSplit = date.split("-");
    	var dateOut = new Date(dateSplit[2], dateSplit[1], dateSplit[0]);
        dateOut.setMonth(dateOut.getMonth() - 1);
        return dateOut;
    };

	/*
	 * fullCalendarIntialize
	 */
	var fullCalendarInitialize = function () {

		// prepare calendar
		$('#calendarspain').fullCalendar( 'destroy'); //removeEvents
		$('#calendarspain').fullCalendar({
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
 			events: $scope.spainEvents,
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
				$scope.monthpicker.dt = $('#calendarspain').fullCalendar('getDate').toDate();
			},
			
			selectAllow: function( selectInfo ) {
				console.log (selectInfo );
				return false;
			}

		});

	}

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