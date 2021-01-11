define(function(require) {	

	var Vue = require("vue");
 	var Notification = require("./notification");
	
	var prefixCls = 'ivu-notice';
	var iconPrefixCls = 'ivu-icon';
	var prefixKey = 'ivu_notice_key_';

	var top = 24;
	var defaultDuration = 4.5;
	var noticeInstance = void 0;
	var key = 1;

	var iconTypes = {
	    'info': 'information-circled',
	    'success': 'checkmark-circled',
	    'warning': 'android-alert',
	    'error': 'close-circled'
	};

	function getNoticeInstance() {
	    noticeInstance = noticeInstance || new Notification({
	        prefixCls: prefixCls,
	        style: {
	            top: top + 'px',
	            right: 0
	        }
	    });

	    return noticeInstance;
	}

	function notice(type, options) {
	    var title = options.title || '';
	    var desc = options.desc || '';
	    var noticeKey = options.key || '' + prefixKey + key;
	    var onClose = options.onClose || function () {};
	    // todo var btn = options.btn || null;
	    var duration = options.duration === 0 ? 0 : options.duration || defaultDuration;

	    key++;

	    var instance = getNoticeInstance();

	    var content = void 0;

	    if (type == 'normal') {
	        content = '\n            <div class="' + prefixCls + '-custom-content">\n                <div class="' + prefixCls + '-title">' + title + '</div>\n                <div class="' + prefixCls + '-desc">' + desc + '</div>\n            </div>\n        ';
	    } else {
	        var iconType = iconTypes[type];
	        content = '\n            <div class="' + prefixCls + '-custom-content ' + prefixCls + '-with-icon">\n                <span class="' + prefixCls + '-icon ' + prefixCls + '-icon-' + type + '">\n                    <i class="' + iconPrefixCls + ' ' + iconPrefixCls + '-' + iconType + '"></i>\n                </span>\n                <div class="' + prefixCls + '-title">' + title + '</div>\n                <div class="' + prefixCls + '-desc">' + desc + '</div>\n            </div>\n        ';
	    }

	    instance.notice({
	        key: noticeKey.toString(),
	        duration: duration,
	        style: {},
	        transitionName: 'move-right',
	        content: content,
	        onClose: onClose,
	        closable: true
	    });
	}

	return {
	    open: function open(options) {
	        return notice('normal', options);
	    },
	    info: function info(options) {
	        return notice('info', options);
	    },
	    success: function success(options) {
	        return notice('success', options);
	    },
	    warning: function warning(options) {
	        return notice('warning', options);
	    },
	    error: function error(options) {
	        return notice('error', options);
	    },
	    config: function config(options) {
	        if (options.top) {
	            top = options.top;
	        }
	        if (options.duration || options.duration === 0) {
	            defaultDuration = options.duration;
	        }
	    },
	    close: function close(key) {
	        if (key) {
	            key = key.toString();
	            if (noticeInstance) {
	                noticeInstance.remove(key);
	            }
	        } else {
	            return false;
	        }
	    },
	    destroy: function destroy() {
	        var instance = getNoticeInstance();
	        noticeInstance = null;
	        instance.destroy();
	    }
	};
    
});