define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./regulationFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//角色编码
			code : null,
			//文件名称
			name : null,
			//批准人
			approver : null,
			//专业审核人
			audit : null,
			//文件作者
			author : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//废止信息
			annulment : null,
			//废止日期
			annulmentDate : null,
			//文件概述
			content : null,
			//实施日期
			effectiveDate : null,
			//文件级别 1:机密,2:内部公开,3:外部公开,4:其他
			fileLevel : null,
			//文件类型 1:管理手册,2:管理程序,3:操作规程,4:作业指导书,5:其他
			fileType : null,
			//是否是已修订 0:不是,1:是(页面只显示未修订的)
			isRevise : null,
			//文件时效 1:现行,2:废止,3:即将实施
			limitation : null,
			//管理要素 1:目标职责,2:制度化管理,3教育培训,4:现场管理,5:安全风险管控和隐患排查治理,6:应急管理,7:事故管理,8:持续改进,9:其他
			manageElement : null,
			//管理范围 1:职业健康(H),2:安全生产(S),3:社会治安(S),4:环境保护(E),5:社会责任(SP),6:其他
			manageScope : null,
			//管理部门
			managerOrg : null,
			//文件编号
			number : null,
			//发布日期
			publishDate : null,
			//修订信息
			revise : null,
			//归口部门
			underOrg : null,
			//章节
			regulationChapters : [],
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
				"code" : [LIB.formRuleMgr.length(100)],
				"name" : [LIB.formRuleMgr.require("文件名称"),
						  LIB.formRuleMgr.length(100)
				],
				"approver" : [LIB.formRuleMgr.require("批准人"),
						  LIB.formRuleMgr.length(100)
				],
				"audit" : [LIB.formRuleMgr.require("专业审核人"),
						  LIB.formRuleMgr.length(100)
				],
				"author" : [LIB.formRuleMgr.require("文件作者"),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"annulment" : [LIB.formRuleMgr.length(500)],
				"annulmentDate" : [LIB.formRuleMgr.allowStrEmpty],
				"content" : [LIB.formRuleMgr.length(500)],
				"effectiveDate" : [LIB.formRuleMgr.allowStrEmpty],
				"fileLevel" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"fileType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"isRevise" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"limitation" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"manageElement" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"manageScope" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"managerOrg" : [LIB.formRuleMgr.length(100)],
				"number" : [LIB.formRuleMgr.length(100)],
				"publishDate" : [LIB.formRuleMgr.allowStrEmpty],
				"revise" : [LIB.formRuleMgr.length(500)],
				"underOrg" : [LIB.formRuleMgr.length(100)],
	        },
	        emptyRules:{}
		},
		selectModel : {
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