define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./opCardBagFormModal.html");
	var opCardSelectModal = require("componentsEx/selectTableModal/opCardSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//唯一标识
			code : null,
			//文件夹名
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : null,
			//序号
			orderNo : null,
			//类型 1:文件夹,2:卡票
			type : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//卡票
			opCard : {id:'', name:''},
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
				"code" : [LIB.formRuleMgr.require("唯一标识"),
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.length()],
				"disable" :LIB.formRuleMgr.require("状态"),
				"orderNo" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("序号")),
				"type" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("类型")),	
	        },
	        emptyRules:{}
		},
		selectModel : {
			opCardSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"opcardSelectModal":opCardSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowOpCardSelectModal : function() {
				this.selectModel.opCardSelectModel.visible = true;
				//this.selectModel.opCardSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveOpCard : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.opCard = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});