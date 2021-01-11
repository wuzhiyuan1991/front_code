define(function(require) {	

	var Vue = require("vue");
	var template =  '<div v-for="(index, value) in values" class="filetr" :style="calcStyle(index)" ><span class="filteTitle" v-show="value.displayTitle">{{value.displayTitle}}:</span>'+
					'<span class="filterBody" :title="title">{{value.displayValue}}</span>'+
					'<Icon @click="doRemoveDisplayCondition(index)"  type="ios-close-empty"></Icon>'+
					'</div>';
    
//	var prefixCls = 'ivu-btn';
//    var iconPrefixCls = 'ivu-icon';

	var calChineseWordNum = function(str) {
		
　　　　var strlen = 0;

　　　　for(var i = 0;i < str.length; i++)
　　　　{
　　　　　　if(str.charCodeAt(i) > 255) //如果是汉字，则字符串长度加2
　　　　　　　　strlen++;
　　　　}
　　　　return strlen;
　　};
    
    var opts = {
    	template : template,
        props: {
            values: {
            	type:Array,
            	default:function(){return []}
            }
        },
        data: function(){
            return{
                title:null
            }
        },
        methods:{
        	doRemoveDisplayCondition : function(index) {
				var value = this.values[index];
//				this.$refs.mainTable.$emit("do_filter", {type:"remove", value: value});
				this.$emit("on-remove-item", {item :  value});
				this.values.splice(index, 1);
        	},
        	calcStyle : function(index) {
        		var value = this.values[index];
        		if(value && value.displayValue) {
        			if(value.displayValue.length > 20 || calChineseWordNum(value.displayValue) > 9){
                        this.title = value.displayValue;
                        return "width:" + 260 + "px;";
                    }else if(value.displayValue.length > 4){
                        this.title = value.displayValue;
                        return ""
                    }
	    		}
                this.title = null;
	    		return ""
        	},
        },
        watch:{
        	values : function(val) {
        	}
        },
    };

	var comp = Vue.extend(opts);
	Vue.component('cust-filter-condition-group', comp);
    
});