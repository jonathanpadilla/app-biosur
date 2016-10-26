(function(){

    var app = angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.routes', 'starter.services']);

    app.run(function($ionicPlatform, $cordovaSQLite, $rootScope){
        $ionicPlatform.ready(function() {

            if(window.cordova && window.cordova.plugins.Keyboard)
            {

                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                cordova.plugins.Keyboard.disableScroll(true);
            }
            
            if(window.StatusBar)
            {
                StatusBar.styleDefault();
            }

            // crear base de datos
            if (window.cordova){$rootScope.db = $cordovaSQLite.openDB({ name: "biosur.db", location: 1});} //device
            else{$rootScope.db = window.openDatabase("biosur.db", '1', 'mantencion biosur', 2 * 1024 * 1024);} // browser

            // crear tabla si no existe
            var query = "CREATE TABLE IF NOT EXISTS mantencion("
                +"id INTEGER PRIMARY KEY AUTOINCREMENT, "
                +"codigo TEXT, "
                +"usuario INTEGER, "
                +"fecha DATETIME, "
                +"comentario TEXT, "
                +"lat INTEGER, "
                +"lng INTEGER)";
                
            $cordovaSQLite.execute($rootScope.db, query);

            if(window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }

            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    });

}());