(function () {
    'use strict';

    angular
        .module('peerApp.controllers')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'userService', 'peerService', '$location', 'socketService','$sce'];
    function HomeController($scope, userService, peerService, $location, socket, $sce) {
        var vm = this;

        vm.userList = [];

       

        if (!userService.currentUser) {
            $location.path('/');
            return;
        }

        vm.currentUser = userService.currentUser;

        peerService.init();

        vm.currentCall = {
            incomming: false,
            outgoing: false,
            to: null,
            from: null,
            message: null
        };

        socket.connect(userService.currentUser.id);
        
        vm.call = function (user) {
            vm.currentCall.outgoing = true;
            vm.currentCall.to = user;
            socket.emit('call', { to: user.id, from: userService.currentUser.id }, function (isUserAttendCall) {
                console.log(isUserAttendCall);
            });
            vm.showCallPopup();
        };

        vm.cutCall = function () {
            var informTo = vm.currentCall.outgoing ? vm.currentCall.to.id : vm.currentCall.from.id;
            socket.emit('endCall', { to: informTo, who: userService.currentUser.id });
            vm.currentCall = {};
            vm.localStream = null;
            peerService.cut();
        };

        vm.mute = function () {
            //todo mute the local stream;
        };

        vm.logout = function(){
            if(vm.currentCall.incomming || vm.currentCall.outgoing){
                vm.cutCall();                
            }
            userService.currentUser = null;
            socket.disconnect();
            $location.path('/');
        };

        vm.checkUserIsBusy = function(){
            return vm.currentCall.incomming || vm.currentCall.outgoing;
        };

        vm.showCallPopup = function (incommingCall) {
            $('#callmodel').modal('show');
        };

        vm.closeCallPopup = function () {
            var informTo = vm.currentCall.outgoing ? vm.currentCall.to.id : vm.currentCall.from.id;
            socket.emit('ignoredCall', { to: informTo, who: userService.currentUser.id });
            vm.currentCall = {};
        };

        vm.attendCall = function () {
            socket.emit('attendedCall', { to: vm.currentCall.from.id, who: userService.currentUser.id });
        };

        vm.getUserNameById = function(id){
            return _.find(vm.userList,function(user){
                return user.id == id;
            }).name;
        };

        vm.getCaleeName = function(){
            var userId = vm.currentCall.outgoing ? vm.currentCall.to.id : vm.currentCall.from.id;
            return vm.getUserNameById(userId);
        };

        $scope.$on('call:localStream',function(evt, stream){
            vm.localStream = URL.createObjectURL(stream);
            $scope.$apply();
            console.log('new local stream ',vm.localStream);
        });

        $scope.$on('call:remoteStream',function(evt, streams){
            vm.remoteStreams = streams;
            $scope.$apply();
            console.log('remote stream ',vm.remoteStreams);
        });

        $scope.$on('call:end',function(evt, streams){
            vm.localStream = null;
            vm.remoteStreams = [];
            console.log('call end ');
        });

        socket.on('userList', function (onlineUsers) {
            console.log('user list is ', onlineUsers);
            vm.userList = onlineUsers;
            $scope.$apply();
        });

        socket.on('newUser', function (user) {
            console.log('new user', user);
            vm.userList.unshift(user);
            $scope.$apply();
        });

        socket.on('removeUser', function (user) {
            var removedUser = _.remove(vm.userList, function (currentUser) {
                return currentUser.id == user.id;
            });

            $.toaster({ priority: 'info', title: removedUser.name, message: 'Gone offline' });
            //if removing user is in call then remove that user remote sream also

            $scope.$apply();
        });

        socket.on('call', function (incommingCall) {
            vm.currentCall.incomming = true;
            vm.currentCall.outgoing = false;
            vm.currentCall.from = _.find(vm.userList, { id: incommingCall.from });
            $scope.$apply();
            vm.showCallPopup();
        });

        socket.on('attendedCall', function (data) {
            peerService.call(vm.currentCall.to.id);
            $.toaster({ priority: 'info', title: 'message', message: 'User attended call' });
            $('#callmodel').modal('hide');
            $scope.$apply();
            //user picked up call
            //initialize peer
        });

        socket.on('cutCall', function (data) {
            var message = vm.getUserNameById(data.who) + "Cut the call";
            $.toaster({ priority: 'info', title: 'message', message: message });
            //user cut call
            //check remote stream length. if it is 0 then cut the call else remove remote stream for that user
        });

        socket.on('ignoredCall', function (data) {
            //user ignored up call
            vm.currentCall.message = "not pick a call. try again later";
            setTimeout(function () {
                $('#callmodel').modal('hide');
                vm.currentCall = {};
            }, 3000);
            $scope.$apply();
        });

        socket.on('endCall',function(data){
            var message = vm.getUserNameById(data.who) + "Cut the call";
            $.toaster({ priority: 'info', title: 'message', message: message });
            vm.currentCall = {};
            peerService.cut();
            $scope.$apply();
        });
    }
})();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           