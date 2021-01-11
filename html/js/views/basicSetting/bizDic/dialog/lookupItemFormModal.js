define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./lookupItemFormModal.html");
	// var lookupSelectModal = require("componentsEx/selectTableModal/lookupSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//id
			id : null,
			//编码
			code : null,
			//名称
			name : null,
			//是否禁用，0启用，1禁用
			disable : "0",
			//国际化code
			i18nCode : null,
			//数据字典code
			lookupCode : null,
			//备注
			remarks : null,
			//类型
			type : null,
			//值
			value : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//数据字典
			lookup : {id:'', name:''},
			content:null
		}
	};

	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'create',
			isReadOnly : false,
			title:"添加",
			showLookupSelectModal : false,
			dicType:[{type:"0",name:"数据字典"},{type:"1",name:"系统参数"},{type:"2",name:"资源配置"}],
			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require("编码"),
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"i18nCode" : [LIB.formRuleMgr.length()],
				"lookupCode" : [LIB.formRuleMgr.length()],
				"remarks" : [LIB.formRuleMgr.length()],
				"type" : [LIB.formRuleMgr.length()],
				"value" : [LIB.formRuleMgr.length(200,0)],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()]
			},
	        emptyRules:{}
		}
	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		// components : {
		// 	"lookupSelectModal":lookupSelectModal,
		// },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doSaveLookup : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.lookup = selectedDatas[0];
				}
			}
		}
	});
	
	return detail;
});