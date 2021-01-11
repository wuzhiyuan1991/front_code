define(function(require) {	

	var Vue = require("vue");
    var Icon = require("./iviewIcon");
    var assist = require("./utils/assist");
	

	
	var template = '<div :class="wrapClasses">'+
					        '<div :class="outerClasses">'+
					    '<div :class="innerClasses">'+
					        '<div :class="bgClasses" :style="bgStyle"></div>'+
					    '</div>'+
					'</div>'+
					'<span v-if="!hideInfo" :class="textClasses">'+
					    '<slot>'+
					        '<span v-if="isStatus" :class="textInnerClasses">'+
					            '<Icon :type="statusIcon"></Icon>'+
					        '</span>'+
					        '<span v-else :class="textInnerClasses">'+
					            '{{ percent }}%'+
					        '</span>'+
					    '</slot>'+
					'</span>'+
					'</div>';
			     
			     
	var prefixCls = 'ivu-progress';

	var opts = {
		template :  template,
	    components: { Icon: Icon },
	    props: {
	        percent: {
	            type: Number,
	            default: 0
	        },
	        status: {
	            validator: function validator(value) {
	                return assist.oneOf(value, ['normal', 'active', 'wrong', 'success']);
	            },

	            default: 'normal'
	        },
	        hideInfo: {
	            type: Boolean,
	            default: false
	        },
	        strokeWidth: {
	            type: Number,
	            default: 10
	        }
	    },
	    computed: {
	        isStatus: function isStatus() {
	            return this.status == 'wrong' || this.status == 'success';
	        },
	        statusIcon: function statusIcon() {
	            var type = '';
	            switch (this.status) {
	                case 'wrong':
	                    type = 'ios-close';
	                    break;
	                case 'success':
	                    type = 'ios-checkmark';
	                    break;
	            }

	            return type;
	        },
	        bgStyle: function bgStyle() {
	            return {
	                width: this.percent + '%',
	                height: this.strokeWidth + 'px'
	            };
	        },
	        wrapClasses: function wrapClasses() {

                var obj = {};
                obj[prefixCls +'-show-info'] = !this.hideInfo;
                
	            return ['' + prefixCls, prefixCls + '-' + this.status, obj];
	        },
	        textClasses: function textClasses() {
	            return prefixCls + '-text';
	        },
	        textInnerClasses: function textInnerClasses() {
	            return prefixCls + '-text-inner';
	        },
	        outerClasses: function outerClasses() {
	            return prefixCls + '-outer';
	        },
	        innerClasses: function innerClasses() {
	            return prefixCls + '-inner';
	        },
	        bgClasses: function bgClasses() {
	            return prefixCls + '-bg';
	        }
	    },
	    compiled: function compiled() {
	        this.handleStatus();
	    },

	    methods: {
	        handleStatus: function handleStatus(isDown) {
	            if (isDown) {
	                this.status = 'normal';
	            } else {
	                if (parseInt(this.percent, 10) == 100) {
	                    this.status = 'success';
	                }
	            }
	        }
	    },
	    watch: {
	        percent: function percent(val, oldVal) {
	            if (val < oldVal) {
	                this.handleStatus(true);
	            } else {
	                this.handleStatus();
	            }
	        }
	    }
	};
	
	
	var component = Vue.extend(opts);
	Vue.component('progress', component);
    
});