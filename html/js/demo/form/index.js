define(function(require) {
	var LIB = require('lib');
	var template = require("text!./index.html");
	var riskModel = require("views/businessFiles/riskAssessment/evaluationModel/dialog/riskModel");
	var dataModel = {
	    	form:{
	    		name: null,
	    		age : 0,
	    		sex : null,
	    		sex2 : null,
	    		language : [],
	    		riskModel: {
	    			id:null,
	    			opts:[],
	    			result:null
	    		}
	    	},
	    	rules: {
	    		name: [
	    	            { required: true, message: '请输入活动名称'},
	    	            { min: 3, max: 5, message: '长度在 3 到 5 个字符'}
	    	          ],
		        age:[  //type可不写，默认为string，同一字段非string类型需多次配置type
		               {type:'integer',required: true, message: '请输入年龄'},
		               {type:'integer',min: 3, max: 5, message: '大小在 3 到 5 之间'}
	    	         ],
    	        sex:[
    	              {required: true, message: '请输入选择性别'},
    	              ],
	    	    sex2:[
		              {required: true, message: '请输入选择性别'},
		              ],
	    	    language:[
	    	         	  {type:'array', min:1, required: true, message: '至少选择1种语言'}
	    	         ],
	    	    riskModel:[//自定义校验规则
	    	               {validator:function(rule, value, callback){
	    	            	   if(!value.id){
	    	            		   return callback(new Error('请选择评估模型信息'));
	    	            	   }else if(!value.result){
	    	            		   return callback(new Error('无效评估模型信息'));
	    	            	   }
	    	            	   return callback();
	    	               }}
	    	         ]
	    	}
	    }
	var opts = {
			template:template,
			components:{
				riskModel:riskModel
			},
			data : function(){
				return dataModel;
			},
			methods: {
				vailForm:function(){
					 this.$refs.ruleform.validate(function (valid){
						 if (valid) {
				            alert('submit!');
				          } else {
				            console.log('error submit!!');
				            return false;
				          }
				        });
				},
				resetForm:function(){
					 this.$refs.ruleform.resetFields();
				},
				doPrintModel:function(){
					console.log(this.form.riskModel);
				}
			}
	}
	var demo = LIB.Vue.extend(opts);
	return demo;
});