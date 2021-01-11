define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./riDutyRecordGroupFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//组名
			groupName : null,
			//值班记录
			riDutyRecord : {id:'', name:''},
			//项
			riDutyRecordItems : [],
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
				"groupName" : [LIB.formRuleMgr.length(200)],
				"riDutyRecord.id" : [LIB.formRuleMgr.allowStrEmpty],
	        },
	        emptyRules:{}
		},
		selectModel : {
			riDutyRecordSelectModel : {
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
		}
	});
	
	return detail;
});