(function(){
	var app = angular.module('starter.routes', []);

	app.config(function($stateProvider, $urlRouterProvider){
		// $ionicConfigProvider.backButton.previousTitleText(false).text('');

		$stateProvider

		.state('ingreso', {
			url: '/ingreso',
			cache: false,
			templateUrl: 'templates/ingreso.html',
			controller: 'IngresoCtrl'
		})

		.state('inicio', {
			url: '/inicio',
			cache: false,
			templateUrl: 'templates/inicio.html',
			controller: 'InicioCtrl'
		})

		.state('mantencion', {
			url: '/mantencion',
			cache: false,
			templateUrl: 'templates/mantencion.html',
			controller: 'MantencionCtrl'
		})

		.state('salir', {
			url: '/salir',
			cache: false,
			controller: 'SalirCtrl'
		});

		$urlRouterProvider.otherwise('/ingreso');
	});

}());