define(function(require) {	

	var Vue = require("vue");
    var assist = require("./utils/assist");
	

	
	var template = '<div :style="circleSize" :class="wrapClasses">'+
					        '<svg viewBox="0 0 100 100">'+
					    '<path :d="pathString" :stroke="trailColor" :stroke-width="trailWidth" :fill-opacity="0"/>'+
					    '<path :d="pathString" :stroke-linecap="strokeLinecap" :stroke="strokeColor" :stroke-width="strokeWidth" fill-opacity="0" :style="pathStyle"/>'+
					'</svg>'+
					'<div :class="innerClasses">'+
					    '<slot></slot>'+
					'</div>'+
					'</div>';
			     
			     
	var prefixCls = 'ivu-chart-circle';

	var opts = {
		template :  template,
		props: {
            percent: {
                type: Number,
                default: 0
            },
            size: {
                type: Number,
                default: 120
            },
            strokeWidth: {
                type: Number,
                default: 6
            },
            strokeColor: {
                type: String,
                default: '#2db7f5'
            },
            strokeLinecap: {
                validator:function(value) {
                    return oneOf(value, ['square', 'round']);
                },
                default: 'round'
            },
            trailWidth: {
                type: Number,
                default: 5
            },
            trailColor: {
                type: String,
                default: '#eaeef2'
            }
        },
        computed: {
            circleSize: function() {
                return {
                    width: this.size + 'px',
                    height: this.size + 'px'
                };
            },
            radius:function() {
                return 50 - this.strokeWidth / 2;
            },
            pathString:function() {
                return 'M 50,50 m 0, -' + this.radius +
                ' a ' + this.radius + ',' + this.radius + ' 0 1 1 0, ' + (2 * this.radius) +
                ' a ' + this.radius + ',' + this.radius + ' 0 1 1 0, -' + (2 * this.radius);
            },
            len:function() {
                return Math.PI * 2 * this.radius;
            },
            pathStyle:function() {
                return {
                    'stroke-dasharray': this.len + 'px ' +  this.len + 'px',
                    'stroke-dashoffset': ((100 - this.percent) / 100 * this.len) + 'px',
                    'transition': 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
                }
            },
            wrapClasses:function() {
                return prefixCls;
            },
            innerClasses:function() {
                return prefixCls + '-inner';
            }
        }
		
		
	};
	
	
	var component = Vue.extend(opts);
	Vue.component('circle', component);
    
});