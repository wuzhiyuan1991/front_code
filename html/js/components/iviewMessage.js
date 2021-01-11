define(function(require) {	

	var Vue = require("vue");
 	var Notification = require("./base/notification/notification");

	
	var prefixCls = 'ivu-message';
	var iconPrefixCls = 'ivu-icon';
	var prefixKey = 'ivu_message_key_';

	var defaultDuration = 1.5;
	var top = void 0;
	var messageInstance = void 0;
	var key = 1;

	var iconTypes = {
	    'info': 'information-circled',
	    'success': 'checkmark-circled',
	    'warning': 'android-alert',
	    'error': 'close-circled',
	    'loading': 'load-c'
	};

	function getMessageInstance() {
	    messageInstance = messageInstance || new Notification({
	        prefixCls: prefixCls,
	        style: {
	            top: top + 'px'
	        }
	    });

	    return messageInstance;
	}

	function notice(content) {
	    var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultDuration;
	    var type = arguments[2];
	    var onClose = arguments[3];
		var closable = false;

	    // 字符超过 20 个显示关闭按钮
		if(content.length>20&&!arguments[1]){
            closable = true;
            duration = 10;
		}


	    if (!onClose) {
	        onClose = function onClose() {};
	    }
	    var iconType = iconTypes[type];

	    // if loading
	    var loadCls = type === 'loading' ? ' ivu-load-loop' : '';

	    var instance = getMessageInstance();

	    instance.notice({
	        key: '' + prefixKey + key,
	        duration: duration,
	        style: {},
	        transitionName: 'move-up',
	        content: '\n            <div class="' + prefixCls + '-custom-content ' + prefixCls + '-' + type + '">\n                <i class="' + iconPrefixCls + ' ' + iconPrefixCls + '-' + iconType + loadCls + '"></i>\n                <div>' + content + '</div>\n            </div>\n        ',
	        onClose: onClose,
            closable:closable
	    });

	    // 用于手动消除
	    return function () {
	        var target = key++;

//	        return function () {
//	            instance.remove('' + prefixKey + target);
//	        };
	        return {
	        	remove : function () {
	        		instance.remove('' + prefixKey + target);
	        	}
	        }
	    }();
	}

	function requestLoading() {
        var div = document.createElement('div');
        div.style.display = 'none';
        div.classList.add('request-loading-box');
        div.innerHTML = '<p style="margin-bottom: 30px;">服务器正在处理中，请稍候...</p><div class="bg-rotate-loader"></div>';
        document.body.appendChild(div);
		this.div = div;
		this.isShowing = false;
    }
    requestLoading.prototype.show = function () {
		if(this.isShowing) {
			return;
		}
        this.isShowing = true;
        this.div.style.display = 'block';
    };
    requestLoading.prototype.hide = function () {
        this.isShowing = false;
        this.div.style.display = 'none';
    };


    function circleLoading() {
        var div = document.createElement('div');
        div.style.display = 'none';
        div.classList.add('request-loading-box');
        div.innerHTML = '<div  class="table-spin"><div class="bg-rotate-loader"></div></div>\n';
        document.body.appendChild(div);
        this.div = div;
        this.isShowing = false;
    }
    circleLoading.prototype.show = function () {
        if(this.isShowing) {
            return;
        }
        this.isShowing = true;
        this.div.style.display = 'block';
    };
    circleLoading.prototype.hide = function () {
        this.isShowing = false;
        this.div.style.display = 'none';
    };


	return {
	    info: function info(content, duration, onClose) {
	        return notice(content, duration, 'info', onClose);
	    },
	    success: function success(content, duration, onClose) {
	        return notice(content, duration, 'success', onClose);
	    },
	    warning: function warning(content, duration, onClose) {
	        return notice(content, duration, 'warning', onClose);
	    },
	    error: function error(content, duration, onClose) {
	        return notice(content, duration, 'error', onClose);
	    },
	    loading: function loading(content, duration, onClose) {
	        return notice(content, duration, 'loading', onClose);
	    },
	    config: function config(options) {
	        if (options.top) {
	            top = options.top;
	        }
	        if (options.duration) {
	            defaultDuration = options.duration;
	        }
	    },
	    destroy: function destroy() {
	        var instance = getMessageInstance();
	        messageInstance = null;
	        instance.destroy();
	    },
        requestLoading: requestLoading,
        circleLoading:circleLoading
	};
    
});