(function(){

	var app = angular.module('starter.services', ['ionic', 'ngCordova']);

	app.factory('location', function($cordovaGeolocation){
        return {
            getLocation: function()
            {
	            var posOptions = {timeout: 10000, enableHighAccuracy: false};

	            return $cordovaGeolocation.getCurrentPosition(posOptions);
				
            }
        }
    });

    app.factory('camera', function($cordovaCamera){
    	return {
    		tomaFoto : function(options)
    		{    			
    			// tomar foto
    			return $cordovaCamera.getPicture(options);

    		}
    	}
    });

    app.factory('almacenarCodigo', function($cordovaSQLite){
        return {
            guardar: function(codigo, usuario, lat, lng)
            {
                if (window.cordova){db = $cordovaSQLite.openDB({ name: "biosur.db", location: 1});}
                else{db = window.openDatabase("biosur.db", '1', 'mantencion biosur', 2 * 1024 * 1024);}

                // obtener fecha y hora
                var fecha   = new Date();
                var anno    = fecha.getFullYear();
                var mes     = ('0'+(fecha.getMonth()+1)).slice(-2);
                var dia     = ('0'+fecha.getDate()).slice(-2);
                var hora    = fecha.getHours();
                var minutos = fecha.getMinutes();

                var dateTime = anno+'-'+mes+'-'+dia+' '+hora+':'+minutos+':00';

                var query = "INSERT INTO mantencion (codigo, usuario, fecha, comentario, lat, lng) VALUES (?, ?, ?, ?, ? ,?)";
                return $cordovaSQLite.execute(db, query, [codigo, usuario, dateTime, 'Sin conexión', lat, lng]);

            },
            mostrar: function()
            {
                if (window.cordova){db = $cordovaSQLite.openDB({ name: "biosur.db", location: 1});}
                else{db = window.openDatabase("biosur.db", '1', 'mantencion biosur', 2 * 1024 * 1024);}

                var query = "SELECT id, codigo, usuario, fecha, comentario, lat, lng FROM mantencion";
                return $cordovaSQLite.execute(db, query);
            },
            limpiar: function()
            {
                if (window.cordova){db = $cordovaSQLite.openDB({ name: "biosur.db", location: 1});}
                else{db = window.openDatabase("biosur.db", '1', 'mantencion biosur', 2 * 1024 * 1024);}

                var query = "DELETE FROM mantencion";
                return $cordovaSQLite.execute(db, query).then(function(rs){
                    return true;
                }, function(err){
                    return false;
                });
            }
        }

    });

}());