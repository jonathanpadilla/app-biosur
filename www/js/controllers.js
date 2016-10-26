(function(){
	var app = angular.module('starter.controllers', ['ngCordova']);
	// var path = 'http://qa.agenciatuciudad.com/Jonathan/biosur/web/app_dev.php';
	var path = 'http://intranet.bbiosur.cl';

	app.controller('IngresoCtrl', function($scope, $http, $state, $ionicHistory, $ionicLoading, $ionicPopup){
		$scope.data = {};

		// icono load
		$scope.show = function() {
		    $ionicLoading.show({
		      	template: '<p>Cargando...</p><ion-spinner></ion-spinner>'
		    });
		};
		$scope.hide = function(){
	        $ionicLoading.hide();
	  	};

		// validar session si ya existe
		var user = window.localStorage.getItem("user_id");
		if(user !== null)
		{
			window.localStorage.clear();
  			$ionicHistory.clearCache();
  			$ionicHistory.clearHistory();

  			window.location.reload(true);
		}

		// funciones
		$scope.login = function()
		{
			var link = path+'/ingreso-app/';
			$scope.show($ionicLoading);

			if($scope.data.rut || $scope.data.clave )
			{
				$http.post(link, {rut : $scope.data.rut, clave: $scope.data.clave }).then(function (res){
		            $scope.response = res.data;

		            if($scope.response.result)
		            {
		            	window.localStorage.setItem("user_id", $scope.response.datos.id);
		            	window.localStorage.setItem("user_nombre", $scope.response.datos.nombre +' '+ $scope.response.datos.apellido);
		            	window.localStorage.setItem("key", $scope.response.datos.key);

		            	$scope.hide($ionicLoading);
		            	$state.go('inicio');
		            }else{
		            	var alertPopup = $ionicPopup.alert({
				            title: 'Datos incorrectos',
				        });
		            	$scope.hide($ionicLoading);
		            }

		        }, function(err){
		        	var alertPopup = $ionicPopup.alert({
			            title: 'Error de conexión',
			        });
		        	$scope.hide($ionicLoading);
		        });
				
			}else{
				var alertPopup = $ionicPopup.alert({
		            title: 'Datos requeridos',
		        });
				$scope.hide($ionicLoading);
			}

        	// console.log("LOGIN user: " + $scope.data.rut + " - PW: " + $scope.data.clave);
    	}

  	});

  	app.controller('InicioCtrl', function($scope, $state, almacenarCodigo, $http, location, $ionicLoading, $ionicPopup){
  		// validar session
		var user = window.localStorage.getItem("user_id");
		if(user === null){$state.go('salir');}
		
		$scope.usuario = window.localStorage.getItem("user_nombre");

		// almacenarCodigo.guardar('B0000007', user, 0, 0);
		// almacenarCodigo.limpiar();
		// mostrar cantidad en boton actualizar
		almacenarCodigo.mostrar().then(function(res){
			$scope.items = '('+res.rows.length+')';
		},function(err){
			$scope.items = '';
		});

		// icono load
		$scope.show = function(){
		    $ionicLoading.show({
		      	template: '<p>Cargando...</p><ion-spinner></ion-spinner>'
		    });
		};

		$scope.hide = function(){
	        $ionicLoading.hide();
	  	};

		// actualizar
		$scope.actualizar = function()
		{
			$scope.show($ionicLoading);
			almacenarCodigo.mostrar().then(function(rs){

				location.getLocation().then(function(position){

					$scope.results = [];
					if(rs.rows.length > 0)
					{
						// console.log(rs.rows.item(0));
						for(var i=0; i<rs.rows.length; i++){
					        $scope.results.push(rs.rows.item(i));
					    }

						// var json = JSON.stringify(rs.rows);
						var link_datos 	= path + '/mantencion/app/actualizar-mantencion/';
						var lat = position.coords.latitude;
						var lng = position.coords.longitude;
						var datos = {'datos':JSON.stringify($scope.results), 'lat':lat, 'lng':lng};

						$http.post(link_datos, datos).then(function(conexion){
							if(conexion.data.result)
							{
								almacenarCodigo.limpiar();
								almacenarCodigo.mostrar().then(function(nrs){
									$scope.items = '('+ nrs.rows.length +')';
								},function(err){
									$scope.items = '';
								});
								var alertPopup = $ionicPopup.alert({title: 'Información actualizada exitosamente.'});
							}else{
								var alertPopup = $ionicPopup.alert({title: 'Error de servidor, intente nuevamente.'});
							}

							$scope.hide($ionicLoading);

						}, function(err){
							console.log(err);
							var alertPopup = $ionicPopup.alert({title: 'Error de conexión'});
							$scope.hide($ionicLoading);
						});
					}else{
						console.log(err);
						var alertPopup = $ionicPopup.alert({title: 'Ubicación no encontrada, active el GPS'});
						$scope.hide($ionicLoading);
					}

				}, function(err){
					console.log(err);
					var alertPopup = $ionicPopup.alert({title: 'Error, ubicación no encontrada.'});
					$scope.hide($ionicLoading);
				});

			}, function(err){
				console.log(err);
				var alertPopup = $ionicPopup.alert({title: 'Error interno, intente nuevamente.'});
				$scope.hide($ionicLoading);
			});
		}

  	});

  	app.controller('MantencionCtrl', function($scope, $cordovaBarcodeScanner, $state, $http, $cordovaFileTransfer, $ionicPopup, $ionicLoading, location, camera, almacenarCodigo){

  		// validar session
		var user = window.localStorage.getItem("user_id");
		if(user === null){$state.go('salir');}

		$scope.data = {};
		$scope.data.comentario = '';

		// icono load
		$scope.show = function() {
		    $ionicLoading.show({
		      	template: '<p>Cargando...</p><ion-spinner></ion-spinner>'
		    });
		};
		$scope.hide = function(){
	        $ionicLoading.hide();
	  	};

		// funciones
		// capturar codigo de barra y qr
		$scope.captureQr = function()
		{
			$scope.show($ionicLoading);
			$cordovaBarcodeScanner.scan().then(
				function(img)
				{
					location.getLocation().then(
						function(position)
						{
							// obtener coordenadas
							$scope.lat = position.coords.latitude;
							$scope.lng = position.coords.longitude;
							
							$scope.data.latitud = position.coords.latitude;
							$scope.data.longitud = position.coords.longitude;

							// enviar a servidor
							$scope.data.codigo = img.text;

							$scope.gpstrue = 'OBTENIDO';
							$scope.gpsfalse = '';

							$scope.hide($ionicLoading);

						},
						function(err)
						{
							// mensaje
							$scope.gpstrue = '';
							$scope.gpsfalse = 'NO OBTENIDO';

							almacenarCodigo.guardar(img.text, user, 0, 0);

							var alertPopup = $ionicPopup.alert({
					            title: 'Coordenadas no obtenidas, Mantención almacenada en el dispositivo.',
					        });

					        $scope.hide($ionicLoading);
						}
					);

				},function(err)
				{
					var alertPopup = $ionicPopup.alert({
			            title: 'Codigo no capturado',
			        });
			        $scope.hide($ionicLoading);
				}
			);

		};

		$scope.tomarFoto = function()
		{
			var options = {
				quality: 75,
				targetWidth: 800,
				targetHeight: 800,
				saveToPhotoAlbum: false,
				correctOrientation: true,
				// destinationType: Camera.destinationType.FILE_URL,
				// sourceType: Camera.PictureSourceType.CAMERA
			};


			camera.tomaFoto(options).then(
				function(imageData)
				{
					$scope.foto = imageData;

					// enviar  servidor
					$scope.data.foto = imageData;
				},function(err)
				{
					alert('Foto no capturada');
				}
			);
		}

		$scope.guardar = function()
		{
			$scope.show($ionicLoading);

			if($scope.data.codigo && $scope.data.latitud && $scope.data.longitud /*&& $scope.data.foto*/)
			{
				// variables
				var link_datos 	= path + '/mantencion/app/agregar-mantencion/';
				var options 	= {};
				var datos 		= {
									key: window.localStorage.getItem("key"),
									codigo: $scope.data.codigo,
									lat: $scope.data.latitud,
									lng: $scope.data.longitud,
									comentario: $scope.data.comentario,
									usuario: user
								}

				$http.post(link_datos, datos).then(
				function(res){
					$scope.response = res.data;

					if($scope.response.result)
					{
						// alert($scope.response.datos);
						$scope.data.codigo 		= '';
						$scope.data.latitud 	= '';
						$scope.data.longitud 	= '';
						// $scope.data.foto 		= '';

						$scope.gpstrue = '';
						$scope.gpsfalse = '';

						var alertPopup = $ionicPopup.alert({
				            title: 'Enviado exitosamente',
				        });

						$scope.hide($ionicLoading);
					}else{
						var alertPopup = $ionicPopup.alert({
				            title: 'Error interno',
				        });
						$scope.hide($ionicLoading);
					}
				}, function(err){
					almacenarCodigo.guardar($scope.data.codigo, user, $scope.data.latitud, $scope.data.longitud);
					var alertPopup = $ionicPopup.alert({
			            title: 'Coordenadas no obtenidas, Mantención almacenada en el dispositivo.',
			        });
					$scope.hide($ionicLoading);
				});

			}else{
				var alertPopup = $ionicPopup.alert({
		            title: 'Información requerida',
		        });
				$scope.hide($ionicLoading);
			}
		}

  	});

  	app.controller('SalirCtrl', function($state, $ionicHistory){
  		window.localStorage.clear();
  		$ionicHistory.clearCache();
  		$ionicHistory.clearHistory();

  		ionic.Platform.exitApp();
  	});

}());