define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./checkBasisFormModal.html");
	var checkBasisTypeSelectModal = require("componentsEx/selectTableModal/checkBasisTypeSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//ID
			id : null,
			//
			code : null,
			//章节名称
			name : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//内容
			content : null,
			//是否禁用，0启用，1禁用
			disable : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//检查依据分类
			checkBasisType : {id:'', name:''},
		}
	};

	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'create',
			isReadOnly : false,
			title:"添加",
			showCheckBasisTypeSelectModal : false,

			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require(""),
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.require("章节名称"),
						  LIB.formRuleMgr.length()
				],
				"content" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		}
	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"checkbasistypeSelectModal":checkBasisTypeSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doSaveCheckBasisType : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.checkBasisType = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});