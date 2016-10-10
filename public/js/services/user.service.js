(function() {
'use strict';

    angular
        .module('peerApp.services')
        .service('userService', UserService);

    UserService.$inject = ['$http','urls'];
    function UserService($http, urls) {
        var hosturl = urls.apiUrl;

        this.currentUser = false;

        this.login = function(user){
            return $http({
                url: hosturl+'login',
                method:'post',
                data : user
            });
        };

        this.register = function(user){
            return $http({
                url: hosturl+'register',
                method:'post',
                data : user
            });
        };
    }
})();