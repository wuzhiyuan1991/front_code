define(function(require){
	var LIB = require('lib');
	var api = require("../vuex/api");
 	//数据模型
	var tpl = require("text!./projThrSimultaneousTaskDetailFormModal.html");
	//初始化数据模型
	var newVO = function() {
		return {
			//角色编码
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//
			compId : null,
			//
			orgId : null,
			//事件描述
			description : null,
			//操作 1:内部评审,2:外部评审,3:申请审查
			operate : null,
			//操作时间
			operateDate : null,
			//参与人员
			person : null,
			//地点
			place : null,
			//项目三同时任务
			projThrSimultaneousTask : {id:'', name:''},
		}
	};

	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'create',
			isReadOnly : false,
			title:"添加",
			fileIds:[],
			files: [],
			//验证规则
	        rules:{
				"code" : [LIB.formRuleMgr.length(100)],
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"description" : [LIB.formRuleMgr.length(1000)],
				"operate" : [LIB.formRuleMgr.require("操作"),LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"operateDate" : [LIB.formRuleMgr.require("时间"),LIB.formRuleMgr.allowStrEmpty],
				"person" : [LIB.formRuleMgr.length(200)],
				"place" : [LIB.formRuleMgr.length(200)],
				"projThrSimultaneousTask.id" : [LIB.formRuleMgr.allowStrEmpty],
	        },
	        emptyRules:{}
		},
		selectModel : {

		},
		fileModel:{
			file : {
				cfg: {
					params: {
						recordId: null,
						dataType: 'CM3',
						fileType: 'CM'
					},
					filters: {
						max_file_size: '10mb',
					},
				},
				data : []
			},
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
			newVO : newVO,
			doCancel:function(){
				this.$emit('on-cancel')
			}
			
		},
		init: function(){
			this.$api = api;
		}
	});
	
	return detail;
});