(function () {
    'use strict';

    angular
        .module('peerApp')
        .service('socketService', SocketService);

    SocketService.$inject = ['userService', 'urls', 'eventEmitter'];

    function EventEmitter() {

    };

    function SocketService(userService, urls, eventEmitter) {

        var connection = null;

        eventEmitter.inject(EventEmitter);
        var customEvents = new EventEmitter();

        this.connect = function (userId) {
            connection = io(urls.socketUrl, {
                transports: ['websocket'],
                upgrade: false,
                query : "userId="+userId
            });

            initializeEvents();
        };

        function initializeEvents() {
            connection.on('connect', function () {
                console.log('socket is connected');
            });

            connection.on('disconnect', function () {
                console.log('socket is disconnected');
                customEvents.emit('disconnect','socket disconnected');
            });

            connection.on('data', function (data, ack) {
                (ack || angular.noop)('reached user');
                customEvents.emit(data.type, data.data);
            });

        };

        this.on = function (name, callback) {
            customEvents.on(name, callback);
        };

        this.emit = function (name, data, ack) {
            var obj = {};
            obj.type = name;
            obj.data = data;
            connection.emit('data', obj, function (data) {
                (ack || angular.noop)(data);
            });
        };

        this.disconnect = function(){
            connection.disconnect();
        };
    };

})();