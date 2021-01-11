define(function(require) {	
	require("jscolor");
	var Vue = require("vue");

	
	var template = '<input type="text" :style="rangeStyle(value)" readonly="readonly"/>';
			     
	var opts = {
		template :  template,
		data:function(){
			return {
				picker:null
			}
		},
	    props: {
	        value: String
	    },
	    ready:function(){
	    	var _this = this;
	    	this.picker = new jscolor(this.$el,{
	    		valueElement:null,
	    		styleElement:null,
	    		zIndex:1052,
	    		closable:true,
	    		closeText:'关闭',
	    		value:_this.value,
	    		onFineChange : function(){
	    			_this.setValue(this.toString());
	    		}
	    	});
	    },
	    methods:{
	    	setValue:function(newValue){
	    		this.value = newValue;
	    	},
			//渲染结果色彩编码单元格
			rangeStyle:function(colorMark){
				return {
					'background-color':'#'+colorMark,
					'border':'none',
					'color':'#'+colorMark,
					'width':'60px'
				}
			}
	    }
	};
	
	var component = Vue.extend(opts);
	Vue.component('jscolor', component);
});