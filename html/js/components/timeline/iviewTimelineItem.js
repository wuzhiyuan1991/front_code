define(function(require) {	

	var Vue = require("vue");

	
	var template = '<li :class="itemClasses">'+
				        '<div :class="tailClasses"></div>'+
				        '<div :class="headClasses" :style="customColor" v-el:dot><slot name="dot"></slot></div>'+
				        '<div :class="contentClasses">'+
				            '<slot></slot>'+
				        '</div>'+
				    '</li>';
			     
			     
	var prefixCls = 'ivu-timeline';

	var opts = {
		template :  template,
		props: {
            color: {
                type: String,
                default: 'blue'
            }
        },
        data: function  data() {
            return {
                dot: false
            }
        },
        ready: function  ready () {
            this.dot = this.$els.dot.innerHTML.length ? true : false;
        },
        computed: {
            itemClasses : function  itemClasses() {
                return prefixCls + '-item';
            },
            tailClasses : function  tailClasses() {
                return prefixCls + '-item-tail';
            },
            headClasses : function  headClasses() {
                var oot ={};
                oot[prefixCls + '-item-head-custom']=this.dot;
                oot[prefixCls + '-item-head-'+this.color]=this.headColorShow;
                return [
                    prefixCls + '-item-head',oot
                    //{
                    //    [prefixCls + '-item-head-custom']: this.dot,
                    //    [prefixCls + '-item-head-'+this.color]: this.headColorShow
                    //}
                ]
            },
            headColorShow: function  headColorShow () {
                return this.color == 'blue' || this.color == 'red' || this.color == 'green';
            },
            customColor: function  customColor() {
                var style = {};
                if (this.color) {
                    if (!this.headColorShow) {
                        style = {
                            'color': this.color,
                            'border-color': this.color
                        }
                    }
                }

                return style;
            },
            contentClasses: function  contentClasses () {
                return prefixCls + '-item-content';
            }
        }
	};
	
	
	var component = Vue.extend(opts);
	Vue.component('timeline-item', component);

	return component;
});