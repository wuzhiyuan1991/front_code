define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./commitmentGroupFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//唯一标识
			code : null,
			//步骤名称
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//安全承诺书
			commitment : {id:'', name:''},
			//执行项
			commitmentItems : [],
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
				"code" : [LIB.formRuleMgr.require("唯一标识"),
						  LIB.formRuleMgr.length(100)
				],
				"name" : [LIB.formRuleMgr.require("步骤名称"),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"commitment.id" : [LIB.formRuleMgr.require("安全承诺书")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			commitmentSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {

		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doSaveCommitment : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.commitment = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});