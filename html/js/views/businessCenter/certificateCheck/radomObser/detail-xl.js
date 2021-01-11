define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	//var checkObjectSelectModal = require("componentsEx/selectTableModal/checkObjectSelectModal");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			//id
			id : null,
			//
			code : null,
			//内容
			content : null,
			//来源 0:手机检查  1：web录入 2 其他
			checkSource : null,
			//状态   1:待审核 2:已转隐患 3:被否决
			status : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//审核时间
			auditDate : null,
			//检查时间
			checkDate : null,
			//关闭时间
			closeDate : null,
			//附件类型 文字：1006 图片：1007 视频：1008
			contentType : null,
			//是否禁用，0启用，1禁用
			disable : null,
			//点赞数
			praises : null,
			//发布者姓名
			publisherName : null,
			//备注
			remarks : null,
			//评论数
			reviews : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//受检对象
			checkObject : {id:'', name:''},
			//检查人
			user : {id:'', name:''},
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			//showCheckObjectSelectModal : false,
			showUserSelectModal : false,
			
			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require(""),
						  LIB.formRuleMgr.length()
				],
				"content" : [LIB.formRuleMgr.require("内容"),
						  LIB.formRuleMgr.length()
				],
				"checkSource" : [LIB.formRuleMgr.require("来源"),
						  LIB.formRuleMgr.length()
				],
				"status" : [LIB.formRuleMgr.require("状态"),
						  LIB.formRuleMgr.length()
				],
				"auditDate" : [LIB.formRuleMgr.length()],
				"checkDate" : [LIB.formRuleMgr.length()],
				"closeDate" : [LIB.formRuleMgr.length()],
				"contentType" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"praises" : [LIB.formRuleMgr.length()],
				"publisherName" : [LIB.formRuleMgr.length()],
				"remarks" : [LIB.formRuleMgr.length()],
				"reviews" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		tableModel : {
		},
		formModel : {
		},
		cardModel : {
		},

	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	el
	 template
	 components
	 componentName
	 props
	 data
	 computed
	 watch
	 methods
	 events
	 vue组件声明周期方法
	 created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {
			//"checkobjectSelectModal":checkObjectSelectModal,
			"userSelectModal":userSelectModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doSaveCheckObject : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.checkObject = selectedDatas[0];
				}
			},
			doSaveUser : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.user = selectedDatas[0];
				}
			},

		},
		events : {
		},
        ready: function(){
        	this.$api = api;
        }
	});

	return detail;
});