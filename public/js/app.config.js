(function (){
    angular.module('peerApp').config(function($routeProvider, $locationProvider){
        $routeProvider.when('/',{
            templateUrl : '../templates/login.html',
            controller : 'LoginController',
            controllerAs : 'login'
        });

        $routeProvider.when('/home',{
            templateUrl : '../templates/home.html',
            controller : 'HomeController',
            controllerAs : 'Peer'
        });

        $routeProvider.when('/register',{
            templateUrl : '../templates/register.html',
            controller : 'LoginController',
            controllerAs : 'login'
        });

        $routeProvider.otherwise('/');

        //$locationProvider.html5Mode(true);

    }).constant('urls',{
        apiUrl : 'https://simple-av.herokuapp.com/api/',
        socketUrl : 'https://simple-av.herokuapp.com'
    })
})();