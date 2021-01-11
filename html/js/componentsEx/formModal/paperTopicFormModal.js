define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./paperTopicFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//
			id : null,
			code:null,
			//名称
			name : null,
			////禁用标识， 1:已禁用，0：未禁用，null:未禁用
			//disable : null,
			////数量
			//num : null,
			//每题的分数
			score : null,
			//说明
			title : null,
			//试题类型 1单选题 2多选题 3判断题 4不定项题
			type : null,
			////修改日期
			//modifyDate : null,
			////创建日期
			//createDate : null,
			////试卷
			//examPaper : {id:'', name:''},
			////试题
			//questions : [],
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
	        	"code":[LIB.formRuleMgr.require("编码")],
				"name" : [LIB.formRuleMgr.require("大题名称"),
					LIB.formRuleMgr.length(20,1)],
				"score" : LIB.formRuleMgr.range(1, 10).concat(LIB.formRuleMgr.require("分数")),
				"type" : [
					{required: true, message: '请选择试题类型'}
				]
	        },
	        emptyRules:{}
		}
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
			newVO : newVO
		},
		ready:function(){
			// console.log(LIB.LIB_BASE.setting.dataDic);
		}
	});
	
	return detail;
});