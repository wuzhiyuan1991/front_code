define(function(require) {	

	var Vue = require("vue");
	


//	var template = '<div class="el-tab-pane" v-show="show && $slots.default">'+
	var template = '<div class="el-tab-pane" v-show="show" :style="{width:width}">'+
				    	'<slot></slot>'+
				    '</div>';
			     
			     
	var prefixCls = 'ivu-poptip';

	var opts = {
		template :  template,
		props: {
	      label: {
	        type: String,
	        required: true
	      },
	      name: String,
	      width:{
	    	  'default':'100%'
	      }
	    },

	    data : function() {
	      return {
	        counter: 0,
	        transition: '',
	        paneStyle: {
	          position: 'relative'
	        },
	        key: ''
	      };
	    },

	    created : function() {
	      if (!this.key) {
	        this.key = this.$parent.$children.indexOf(this) + 1 + '';
	      }
	    },

	    computed : {
	      show : function() {
	        return this.$parent.currentName === this.key;
	      }
	    },

	    destroyed : function() {
			//Vue.destroyed方法自动移除当前节点
	    	if(this.$el) {
	    		this.$el.remove();
	    	}
	    },

	    watch: {
//	      name: {
//	        immediate: true,
//	        handler(val) {
//	          this.key = val;
//	        }
//	      },
	      name: function(val){
	          this.key = val;
	      },
	      '$parent.currentName' : function(newValue, oldValue) {
	        if (this.key === newValue) {
	          this.transition = newValue > oldValue ? 'slideInRight' : 'slideInLeft';
	        }
	        if (this.key === oldValue) {
	          this.transition = oldValue > newValue ? 'slideInRight' : 'slideInLeft';
	        }
	      }
	    }
	};
	
	
	var component = Vue.extend(opts);
	Vue.component('el-tab-pane', component);
    
});