define(function(require) {	

	var Vue = require("vue");
	
	var Notice = require("./iviewNotice");
	
	var prefixCls = 'ivu-notification';

	var template = '<div :class="classes" :style="style">'+
				        '<Notice v-for="notice in notices"'+
				            ':prefix-cls="prefixCls"'+
				            ':style="notice.style"'+
				            ':content="notice.content"'+
				            ':duration="notice.duration"'+
				            ':closable="notice.closable"'+
				            ':key="notice.key"'+
				            ':transition-name="notice.transitionName"'+
				            ':on-close="notice.onClose">'+
				        '</Notice>'+
				    '</div>'+
					'';
	
	var seed = 0;
	var now = Date.now();

	function getUuid() {
	    return 'ivuNotification_' + now + '_' + seed++;
	}

	var opts = {
		template : template,

	    components: { Notice:Notice },
	    props: {
	        prefixCls: {
	            type: String,
	            default: prefixCls
	        },
	        style: {
	            type: Object,
	            default: function _default() {
	                return {
	                    top: '65px',
	                    left: '50%'
	                };
	            }
	        },
	        content: {
	            type: String
	        },
	        className: {
	            type: String
	        }
	    },
	    data: function data() {
	        return {
	            notices: []
	        };
	    },
	
	    computed: {
	        classes: function classes() {
	        	var obj = {};
	        	obj[this.className] = !!this.className;
//	            return ['' + prefixCls,  {this.className  !!this.className}];
	            return ['' + this.prefixCls,obj
					//{[this.className] : !!this.className}
	];
	        }
	    },
	    methods: {
	        add: function add(notice) {
	            var key = notice.key || getUuid();
	
//	            var _notice = (0, _assign2.default)({
//	                style: {
//	                    right: '50%'
//	                },
//	                content: '',
//	                duration: 1.5,
//	                closable: false,
//	                key: key
//	            }, notice);
	            
	            var _notice = _.extend({
	                style: {
	                    right: '50%'
	                },
	                content: '',
	                duration: 1.5,
	                closable: false,
	                key: key
	            }, notice);
	
	            this.notices.push(_notice);
	        },
	        close: function close(key) {
	            var notices = this.notices;
	
	            for (var i = 0; i < notices.length; i++) {
	                if (notices[i].key === key) {
	                    this.notices.splice(i, 1);
	                    break;
	                }
	            }
	        }
	    }
	};
	
	
	var component = Vue.extend(opts);
	Vue.component('notification', component);
    
});