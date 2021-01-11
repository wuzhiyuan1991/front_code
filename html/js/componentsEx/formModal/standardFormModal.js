define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./standardFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//角色编码
			code : null,
			//英文标准名称
			enName : null,
			//中文标准名称
			chName : null,
			//标准号
			number : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//废止信息
			annulment : null,
			//废止日期
			annulmentDate : null,
			//标准简介
			content : null,
			//中国标准分类号
			cssCode : null,
			//CCS分类
			cssType : null,
			//国内行业分类
			domesticType : null,
			//实施日期
			effectiveDate : null,
			//效力级别
			effectiveLevel : null,
			//国际标准分类号
			icsCode : null,
			//ICS分类
			icsType : null,
			//国外行业协会分类
			internationalType : null,
			//是否是已修订 0:不是,1:是(页面只显示未修订的)
			isRevise : null,
			//文件时效 1:现行,2:废止,3:即将实施
			limitation : null,
			//管理部门
			managerOrg : null,
			//发布日期
			publishDate : null,
			//发布单位
			publishOrg : null,
			//修订信息
			revise : null,
			//归口部门
			underOrg : null,
			//章节
			standardChapters : [],
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
				"enName" : [LIB.formRuleMgr.require("英文标准名称"),
						  LIB.formRuleMgr.length(100)
				],
				"chName" : [LIB.formRuleMgr.require("中文标准名称"),
						  LIB.formRuleMgr.length(100)
				],
				"number" : [LIB.formRuleMgr.require("标准号"),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"annulment" : [LIB.formRuleMgr.length(500)],
				"annulmentDate" : [LIB.formRuleMgr.allowStrEmpty],
				"content" : [LIB.formRuleMgr.length(500)],
				"cssCode" : [LIB.formRuleMgr.length(100)],
				"cssType" : [LIB.formRuleMgr.length(100)],
				"domesticType" : [LIB.formRuleMgr.length(100)],
				"effectiveDate" : [LIB.formRuleMgr.allowStrEmpty],
				"effectiveLevel" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"icsCode" : [LIB.formRuleMgr.length(100)],
				"icsType" : [LIB.formRuleMgr.length(100)],
				"internationalType" : [LIB.formRuleMgr.length(100)],
				"isRevise" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"limitation" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"managerOrg" : [LIB.formRuleMgr.length(100)],
				"publishDate" : [LIB.formRuleMgr.allowStrEmpty],
				"publishOrg" : [LIB.formRuleMgr.length(100)],
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