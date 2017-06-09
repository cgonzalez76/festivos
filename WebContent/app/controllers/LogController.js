var app = angular.module("festivos.Controllers");

app.controller( "LogController", 

    function($controller, $timeout, $scope, $rootScope, $location, $sce, $filter, md5, NotifyService, DTOptionsBuilder, DTColumnDefBuilder, logServices, tabsFactory) {

        //al abrir la pagina Tabfactory que gestiona todos los datos del tab abierto facilita el id de la pagina
        $scope.idTab = tabsFactory.maintab.id;

        //accesos resgistrados en el menu para este elemento true/false
        //_add, _del, _edit, _read
        $scope.access = tabsFactory.maintab.access;

        $scope.BotonAddName='log.addProfile';
        $scope.BotonAddFunction = function (e, dt, node, config) {
            $scope.addProfile ();
        };

		$scope._shouldRender = true;

		$scope.dataRecords = [];
		$scope.functionalities = [];

		$scope.operationOver = {
			record: null
		}



        /**********************************************
         * FORMS CONFIGURATION
         * ********************************************/

        //
        function loadLogEntries () {
            $scope.dataRecords = [];
            var days = 15;

            logServices.loadLogEntries( days, function(res, status) {

                if (status == 200 && res != null) {
                	
					$scope.dataRecords = res;

                } else {
					var msg = '(' + status + ') ' + (res && res.message ? res.message : + 'Error al recibir los datos');

					NotifyService.several (msg, tabsFactory.maintab);

				}

            });

        }

        $scope.initializeLog = function () {
        	
 //       	breadcrumbFactory.setPath (breadcrumbFactory.Breadcrumb.PROFILES );
        	
            $scope.dtColumnDefs = [
                //DTColumnDefBuilder.newColumnDef(0).notSortable().withOption('sContentPadding', '0').withOption('width', '50px').withOption('padding', '0'),
                DTColumnDefBuilder.newColumnDef(0).withOption('width', '165px'),
                DTColumnDefBuilder.newColumnDef(1).withOption('width', '135px'),
                DTColumnDefBuilder.newColumnDef(2).withOption('width', '180px'),
                DTColumnDefBuilder.newColumnDef(3).withOption('width', '320px'),
                DTColumnDefBuilder.newColumnDef(4).withOption('width', '320px'),
                DTColumnDefBuilder.newColumnDef(5).withOption('width', '130px'),
                DTColumnDefBuilder.newColumnDef(6).withOption('width', '130px')
            ];
            
            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('responsive', true)
                .withOption('bAutoWidth', true)
                .withOption('stateSave', true)
                .withOption('order', [0, 'desc'])
                .withDOM('Zlfrtip')
                .withOption("colResize",{"exclude":[]})
                .withPaginationType('full_numbers')




 /*           if($scope.access.add) {
                $scope.dtOptions.withButtons([
                    {
                        text: '<i class="fa fa-plus-circle" style="margin-right:5px;" ></i>' + $filter('translate')($scope.BotonAddName),
                        key: '1',
                        action: $scope.BotonAddFunction
                    }
                ]);
            }*/

            loadLogEntries();
            
        }



       
        /**********************************************
         * CONTROLLER BASICS
         * ********************************************/
		// Control de instancias dataTable para Rerender()
        $scope.dtInstance = {};
 
        $scope.$on('L10NFactory:languageChanged', function(event, args) {

           $timeout (function () {
                //refrescar botones por cambio idioma sólo si existen botones
                if($scope.access.add && $scope.BotonAddName!=null) {
                    $scope.dtOptions = DTOptionsBuilder.newOptions()
                        .withOption('responsive', true)
                        .withOption('bAutoWidth', true)
                        .withOption('stateSave', true)
                        .withPaginationType('full_numbers')
                        .withDOM('Zlfrtip')
                        .withButtons([
                        {
                            text: '<i class="fa fa-plus-circle" style="margin-right:5px;" ></i>' + $filter('translate')($scope.BotonAddName),
                            key: '1',
                            action: $scope.BotonAddFunction
                        }
                    ]);
                }

        	//$scope.dtInstance.rerender(); // si se activa rerender da problemas al cambiar las DTOptionsBuilder
            // el simple mostrar y ocultar tabla ya refresca nuevo idioma sin dar errores

        		$scope._shouldRender = false;
        	}, 90);

        	$timeout (function () {
        		$scope._shouldRender = true;
        	}, 110);
        	

        });

        $scope.dtInstanceCallback = function (dtInstance) {
        	$scope.dtInstance = dtInstance;
        	
        }


	}

);
