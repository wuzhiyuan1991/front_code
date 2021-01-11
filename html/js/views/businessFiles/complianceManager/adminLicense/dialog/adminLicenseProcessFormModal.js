define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./adminLicenseProcessFormModal.html");
	var api = require("../vuex/api");
	//初始化数据模型
	var newVO = function() {
		return {
			//角色编码
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//内容
			content : null,
			//操作 1:企业初次申请,2:企业变更申请,3:企业延续申请,4:政府审查,5:政府批准,6:企业修订,10:其他
			operate : null,
			//操作时间
			operateDate : null,
			//行政许可
			adminLicense : {id:'', name:''},
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
				// "code" : [LIB.formRuleMgr.length(100)],
				// "disable" :LIB.formRuleMgr.require("状态"),
				"content" : [LIB.formRuleMgr.length(500)],
				"operate" : [LIB.formRuleMgr.allowIntEmpty,LIB.formRuleMgr.require("操作")].concat(LIB.formRuleMgr.allowIntEmpty),
				"operateDate" : [LIB.formRuleMgr.allowStrEmpty,,LIB.formRuleMgr.require("操作时间")],
				// "adminLicense.id" : [LIB.formRuleMgr.allowStrEmpty],
	        },
	        emptyRules:{}
		},
		selectModel : {
			adminLicenseSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},
		fileModel:{
			file : {
				cfg: {
					params: {
						recordId: null,
						dataType: 'CM1',
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
		},
		init: function(){
			this.$api = api;
		}
	});
	
	return detail;
});