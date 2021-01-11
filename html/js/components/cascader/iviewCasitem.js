define(function(require) {
	var Vue = require("vue");
	var template = '<li :class="classes">{{ data.label }}<i v-if="data.children && data.children.length" class="ivu-icon ivu-icon-ios-arrow-right"></i></li>';
	var opts = {
		template: template,
        props: {
            data: Object,
            prefixCls: String,
            tmpItem: Object
        },
        computed: {
            classes : function() {
            	var obj = {};
            	obj[this.prefixCls+'-menu-item-active'] = (this.tmpItem.value === this.data.value);
            	obj[this.prefixCls+'-menu-item-disabled'] = this.data.disabled
                return [
                    this.prefixCls+'-menu-item',obj
                ]
            }
        }
    }
    var component = Vue.extend(opts);
//	Vue.component('calendar', component);
    return component;
});