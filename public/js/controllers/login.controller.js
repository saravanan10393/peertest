(function() {
'use strict';

    angular
        .module('peerApp.controllers')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope','userService','$location'];
    function LoginController($scope, userService,$location) {
        var vm = this;
        

        vm.login = login;

        vm.register = register;

        ////////////////

        function login() {
            userService.login({email:vm.email, password: vm.password}).then(function(success){
                var data = success.data;
                if(data.error){
                    alert(data.message);
                    return;
                }
                userService.currentUser = data;
                $location.path('/home');
                
            },function(error){
                userService.currentUser = null;
                console.log('login error');
            });
        };

        function register(){
            userService.register({email : vm.email, password : vm.password, name : vm.name}).then(function(success){
                var data = success.data;
                if(data.error){
                    alert(data.message);
                    return;
                }
                userService.currentUser = data;
                $location.path('/home');
            },function(error){
                userService.currentUser = null;
                console.log('registration error');
            });
        };
    }
})();