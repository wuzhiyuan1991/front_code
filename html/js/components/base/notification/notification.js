define(function(require) {	

	var Vue = require("vue");
	var Notification = require("./iviewNotification");
//	import { camelcaseToHyphen } from '../../../utils/assist';
	var assist = require("../../utils/assist");
	
	return function(properties) {
		
		var _props = properties || {};
	
		    var props = '';
//		    _props.forEach(function (prop) {
//		        props += ' :' + (0, _assist.camelcaseToHyphen)(prop) + '=' + prop;
//		    });

			for(var prop in _props) {
		        props += ' :' + assist.camelcaseToHyphen(prop) + '=' + prop;
			}
			
		    var div = document.createElement('div');
		    div.innerHTML = '<notification' + props + '></notification>';
		    document.body.appendChild(div);
	
		    var notification = new Vue({
		        el: div,
		        data: _props,
		        components: { Notification:Notification }
		    }).$children[0];
	
		    return {
		        notice: function notice(noticeProps) {
		            notification.add(noticeProps);
		        },
		        remove: function remove(key) {
		            notification.close(key);
		        },
	
		        component: notification,
		        destroy: function destroy() {
		            document.body.removeChild(div);
		        }
		    };
	};
	
    
});