define(function(require) {	

	var Vue = require("vue");
    var assist = require("../utils/assist");
	

	
	var template = '<div :class="wrapClasses" :style="styles">'+
				        '<div :class="[prefixCls + \'-tail\']"><i></i></div>'+
				        '<div :class="[prefixCls + \'-head\']">'+
				            '<div :class="[prefixCls + \'-head-inner\']">'+
				                '<span v-if="!icon && status != \'finish\' && status != \'error\'">{{ stepNumber }}</span>'+
				                '<span v-else :class="iconClasses"></span>'+
				            '</div>'+
				        '</div>'+
				        '<div :class="[prefixCls + \'-main\']">'+
				            '<div :class="[prefixCls + \'-title\']">{{ title }}</div>'+
				            '<div v-if="content" :class="[prefixCls + \'-content\']">{{ content }}</div>'+
				        '</div>'+
				    '</div>';
			     
			     
	var prefixCls = 'ivu-steps';
    var iconPrefixCls = 'ivu-icon';

	var opts = {
		template :  template,
		props: {
            status: {
                validator : function(value) {
                    return assist.oneOf(value, ['wait', 'process', 'finish', 'error']);
                }
            },
            title: {
                type: String,
                default: ''
            },
            content: {
                type: String
            },
            icon: {
                type: String
            }
        },
        data : function() {
            return {
                prefixCls: prefixCls,
                stepNumber: '',
                nextError: false,
                total: 1
            }
        },
        computed: {
            wrapClasses : function() {
                var obj = {};
                obj[prefixCls + '-custom'] = !!this.icon;
                obj[prefixCls + '-next-error'] = this.nextError;
                return [
                    prefixCls + '-item',
                    prefixCls + '-status-' + this.status,
                    obj
                ]
            },
            iconClasses : function() {
                var icon = '';

                if (!!this.icon) {
                    icon = this.icon;
                } else {
                    if (this.status == 'finish') {
                        icon = 'ios-checkmark-empty';
                    } else if (this.status == 'error') {
                        icon = 'ios-close-empty';
                    }
                }
                
                var obj = {};
                obj[iconPrefixCls + "-" + icon] = icon != '';
                return [
                    prefixCls + '-icon',
                    iconPrefixCls,
                    obj
                ]
            },
            styles:function () {
                return {
                    width: 1/this.total*100 + '%'
                }
            }
        },
        watch: {
            status : function() {
                if (this.status == 'error') {
                    this.$parent.setNextError();
                }
            }
        }
	};
	
	
	var component = Vue.extend(opts);
	Vue.component('step', component);
    
});