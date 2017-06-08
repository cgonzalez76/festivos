var app = angular.module("festivos.Controllers", []);

app.controller("MainController", 


	function ($scope, $rootScope, $q, $location, $filter) {
		$scope.selectedButton;
		$scope._ActionTypes = {
				TREE:		'tree',
				LIST:		'list',
				URL:		'url',
				BACK:		'back',
				CMD:        'cmd',
				NAV:		'nav'
				
		};
		
		$scope.openPage=function (pagina) {
			$scope.selectedButton
			window.location.href = "/" + pagina;
		};
	}
);