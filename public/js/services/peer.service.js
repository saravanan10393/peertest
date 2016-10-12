(function () {
    'use strict';

    angular
        .module('peerApp.services')
        .service('peerService', PeerService);

    var peerstreams = [], localstream, peer, mediaConnection;

    PeerService.$inject = ['$http', 'socketService', 'userService','$rootScope'];
    function PeerService($http, socket, userService, $rootScope) {
        this.peerstreams = peerstreams;
        this.localStream = localstream;
        var that = this;

        this.init = function(){
            initPeer(userService.currentUser.id, $rootScope);
        };
        
        this.call = function (to) {
            getStream({}, function (stream) {
                that.localStream = URL.createObjectURL(stream);
                localstream = stream;
                console.log('create object url ',that.localStream);
                mediaConnection = peer.call(to, stream);
                initializeMediaStream(mediaConnection, $rootScope);
                $rootScope.$broadcast('call:localStream',stream);
            });
        };

        this.answer = function (to) {
            
        };

        this.cut = function (call) {
            this.peerstreams = [];
            peerstreams = [];
            stopLocalStream();
            mediaConnection.close();
            mediaConnection = null;
        };

        socket.on('disconnect', function () {
            peerstreams = [];
            peer.disconnect();
        });
    }

    var constraints = {
        audio: true,
        video: {
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 },
        }
    };

    function getStream(option, callback) {
        angular.extend(constraints, option);
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;

        navigator.getUserMedia(constraints, callback || handleMediaStream, handleFallback);
    }

    function handleMediaStream(stream) {
        localstream = stream;
    }

    function handleFallback(error) {
        console.log('failed to get usermedia ', error)
    }

    function initPeer(id, $rootScope) {
        id = id || Math.random() * 100000;
        peer = new Peer(id, {host: "peercli.herokuapp.com",port:"443", path:"/"}); // { key: "2wdzltj1qacnb3xr", debug: 3 }

        peer.on('open', function () {
            console.info('peer is connected to peer server');
        });

        peer.on('disconnected', function () {
            console.warn('peer is disconnected from peer server. attempting to reconnect');
            //peer.reconnect();
        });

        peer.on('error', function (err) {
            console.error('peer error ', err);
        });

        peer.on('call', function (mediaConnection) {
            getStream({}, handleMediaConnection);
            function handleMediaConnection(stream) {
                localstream = stream;
                mediaConnection.answer(stream);
                initializeMediaStream(mediaConnection, $rootScope);
                $rootScope.$broadcast('call:localStream', stream);
                //emit localstream
            }
        });
    }

    function stopLocalStream(){
        localstream.getTracks().forEach(function(track){
            track.stop();
        });
    }

    function initializeMediaStream(incommingConnection, $rootScope){
        console.log('initializeMediaStream is called');
        mediaConnection = incommingConnection;
        mediaConnection.on('stream', function (remoteStream) {
            console.log('onstream is called');
            if (_.find(peerstreams, { id: mediaConnection.peer })) {
                console.log('skipping duplicate stream for id', mediaConnection.peer);
                return;
            }
            peerstreams.push({
                id: mediaConnection.peer,
                type: 'remote',
                stream: remoteStream,
                url: URL.createObjectURL(remoteStream)
            });

            $rootScope.$broadcast('call:remoteStream', peerstreams);
        });

        mediaConnection.on('close',function(evt){
            console.log('mediaConnection  onClose ',evt);
            peerstreams = [];
            stopLocalStream();
            //close the local media connection
            mediaConnection.close();
            mediaConnection = null;
            $rootScope.$broadcast('call:end',evt);
        });

        mediaConnection.on('error',function(err){
            peerstreams = [];
            stopLocalStream();
            console.log('mediaConnection  onError ',err);
        });
    }
})();