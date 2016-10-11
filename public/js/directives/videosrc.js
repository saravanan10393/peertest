angular.module('peerApp').directive('videoSrc', function () {
    return {
        link: function (scope, elem, attr) {
            attr.$observe('videoSrc', function (value) {
                if(!value) return;
                var container = $(elem).empty();
                var videoElem = $('<video autoplay style="width:100%;height:100%"></video>');
                videoElem.attr('src',attr.videoSrc);
                container.append(videoElem);
            });
        }
    }
});