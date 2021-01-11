define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./changePassword.html");

	var newVO = function() {
		return {
			oldPwd:"",
			newPwd:"",
			resetPwd:"",
			validationRules:null
		}
	};

	//数据模型
	var dataModel = {
			mainModel : {
				vo : newVO()
			},
		isShowPassword:true,
		//提示信息
		tpsName:null
	};
	
	//声明detail组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	el
		template
		components
		componentName
		props
		data
		computed
		watch
		methods
		events 
		vue组件声明周期方法 
		created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var selectDialog = LIB.Vue.extend({
		template: tpl,
		props:['passfrom'],
		data:function(){
			return dataModel;
		},
		methods:{
			initData: function () {
				this.mainModel.vo = this.passfrom;
			},



		},
		watch: {
			passfrom:function(){
				this.initData();
			},
			//"mainModel.vo.validationRules.miniLength":function(){
			//	if(this.mainModel.vo.validationRules.miniLength){
			//		this.filterData();
			//	}
            //
			//}
		},
		ready: function () {
			this.initData();
		},
		events: {
			"ev_passWordReload": function () {
				var _vo = dataModel.mainModel.vo;
				//清空数据
				_.extend(_vo, newVO());
			},
			"ev-change":function(){
				//miniLength代表最小长度 letter 必须包含字母 number必须包含数字 caseLetter包含大小写字母
				//specialCharacter必须包含字母和数字以外的特殊字符
				this.mainModel.vo = this.passfrom;
				if(this.mainModel.vo.validationRules.miniLength=="1"){
					this.tpsName = "最小长度6个字符"
				}else if(this.mainModel.vo.validationRules.miniLength=="2"){
					this.tpsName = "最小长度8个字符"
				}else if(this.mainModel.vo.validationRules.miniLength=="3"){
					this.tpsName = "最小长度10个字符"
				}else if(this.mainModel.vo.validationRules.miniLength=="4"){
					this.tpsName = "无限制"
				}
				if(this.mainModel.vo.validationRules.letter==1){
					this.tpsName =this.tpsName + ",必须包含字母"
				}
				if(this.mainModel.vo.validationRules.number==1){
					this.tpsName =this.tpsName + ",必须包含数字"
				}
				if(this.mainModel.vo.validationRules.caseLetter==1){
					this.tpsName =this.tpsName + ",必须包含大小写字母"
				}
				if(this.mainModel.vo.validationRules.specialCharacter==1){
					this.tpsName =this.tpsName + ",必须包含字母和数字以外的特殊字符"
				}
			},
		},
	});
	
	return selectDialog;
});