define(function (require) {
    var LIB = require("lib");
    // require("sewisePlayer");
    SewisePlayer = null;
    var helper = {
        isRequireLazyLoaded: function () {
            return !!SewisePlayer;
        },
        requireLazyLoad: function (playerId, video) {
            var _this = this;
            require(['sewisePlayer'], function () {
                _this.create(playerId, video);
            });
        },
        create: function (playerId, video) {
            if(!this.isRequireLazyLoaded()) {
                this.requireLazyLoad(playerId, video);
                return;
            }
            var videoUrl;
            if(video.attr5 == 'OSS') {
                videoUrl = video.fullSrc;
            } else {
                videoUrl = LIB.ctxPath("/file/play/" + video.fileId)
            }
            SewisePlayer.setup({
                server: "vod",
                type: "mp4",
                logo: "images/menu/saiweiLogo.png",
                videourl: videoUrl,
                skin: "vodWhite",
                autostart: 'false',
                topbardisplay: 'disable',
                claritybutton: 'enable',
                controlbardisplay: 'enable',
                lang: 'zh_CN'
            }, playerId);
        },

    };
    return helper;
});