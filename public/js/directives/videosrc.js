angular.module('peerApp').directive('videoSrc', function () {
    return {
        link: function (scope, elem, attr) {
            attr.$observe('videoSrc', function (value) {
                if(!value) return;
                var container = $(elem).empty();
                var videoElem = $('<video autoplay width="150px" height="150px"></video>');
                videoElem.attr('src',attr.videoSrc);
                container.append(videoElem);
            });
        }
    }
});