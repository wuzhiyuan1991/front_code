define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./opMaintStepItemFormModal.html");
	// var opMaintStepSelectModal = require("componentsEx/selectTableModal/opMaintStepSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//唯一标识
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : '0',
			//序号
			orderNo : null,
			//操作内容
			content : null,
			//修改日期
			// modifyDate : null,
			//创建日期
			// createDate : null,
			//维检修工序
			// opMaintStep : {id:'', name:''},
			//维检修工序明细负责人类型关联
            principalType : []
		}
	};

	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'create',
			isReadOnly : false,
			title:"添加",

			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"content" : [
					LIB.formRuleMgr.require("操作内容"),
					LIB.formRuleMgr.length(1000)
				],
				"principalType": [
					{type: 'array', required: true, message: '请选择负责人' }
				]
	        },
	        emptyRules:{},
			code: ''
		}

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
            afterInitData: function (data) {
				this.mainModel.vo.principalType = _.map(data.opMaintStepItemPrinTypes, function (item) {
					return item.principalType;
                })
            },
            afterInit: function (vo) {
				this.mainModel.code = vo.code;
            }
		}
	});
	
	return detail;
});