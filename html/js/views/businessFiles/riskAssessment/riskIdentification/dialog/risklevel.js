define(function(require){
	var LIB = require('lib');
 	//数据模型
	var api = require("../vuex/api");
	var tpl = require("text!./risklevel.html");
	var riskModel = require("views/basicSetting/basicFile/evaluationModel/dialog/riskModel");

	var newVO = function() {
		return {
			id :null,
			riskLevel:null,
			riskModelId:null,
			residualRiskLevel:null,
			residualRiskModelId:null,
			residualRiskModel:null,
		}
	};
	
	//数据模型
	var dataModel = {
		mainModel : {
			vo : newVO(),
			isReadOnly : true,
			type:null
		},
		riskModel:{
			id:null,
			opts:[],
			result:null
		},
		residualRiskModel:{
			id:null,
			opts:[],
			result:null
		},
		//验证规则
		rules:{
			riskLevel:[{ required: true, message: '请选择风险评价'}],
			residualRiskLevel:[{ required: true, message: '请选择剩余风险评价'}],
		},
	};
	
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
	var detail = LIB.Vue.extend({
		template: tpl,
		components : {
			'riskModel':riskModel,
		},
		data:function(){
			return dataModel;
		},
		methods: {
			doSave: function () {
				var _this = this;
				var _vo = _this.mainModel.vo;
				if (_this.mainModel.type == '1') {
					_vo.riskLevel = _this.riskModel.result;
					_vo.riskModelId = _this.riskModel.id;
					_vo.riskModel = JSON.stringify(_this.riskModel);
				} else {
					_vo.residualRiskLevel = _this.residualRiskModel.result;
					_vo.residualRiskModelId = _this.residualRiskModel.id;
					_vo.residualRiskModel = JSON.stringify(_this.residualRiskModel);
				}
				this.$refs.ruleform.validate(function (valid) {
					if (valid) {
						if(_this.mainModel.type == '3'){
							api.saveRiskAssess(_this.mainModel.vo).then(function(res){
								_this.$emit("do-update-risk-level-finshed");
								LIB.Msg.info("修改成功");
							});
						}else{
							api.updateRiskLevel(_this.mainModel.vo).then(function(res){
								_this.$emit("do-update-risk-level-finshed");
								LIB.Msg.info("修改成功");
							});
						}

					}
				});
			},
		},
		events : {
			"ev_updateRiskLevelReload" : function(id,type){//1 现有，2增补,3风险评估
				//清空验证
        		this.$refs.ruleform.resetFields();
                this.mainModel.isReadOnly = true;
				dataModel.riskModel={};
				dataModel.residualRiskModel={};
				var _vo = dataModel.mainModel.vo;
				this.mainModel.type = type;
				_.extend(_vo,newVO());
				_vo.id = id;
			},
		}
	});
	
	return detail;
});