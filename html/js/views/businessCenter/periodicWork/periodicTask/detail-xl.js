define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var checkTableSelectModal = require("componentsEx/selectTableModal/checkTableSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			//检查任务id
			id : null,
			//
			code : null,
			name:null,
			//结束时间
			endDate : null,
			//开始时间
			startDate : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//实际完成时间
			checkDate : null,
			//是否禁用，0未发布，1发布
			disable : null,
			//任务序号
			num : null,
			//任务状态 默认0未到期 1待执行 2按期执行 3超期执行 4未执行
			status : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//检查计划
			checkPlan : {id:'', name:''},
			//检查表
			checkTable : {id:'', name:''},
            checkUser:{username:''},
            groupName: '',
			checkLevel: null
		}
	};
	//Vue数据
	var dataModel = {
		enableCheckLevel: false,
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			showCheckPlanSelectModal : false,
			showCheckTableSelectModal : false,
			
			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require(""),
						  LIB.formRuleMgr.length()
				],
				"endDate" : [LIB.formRuleMgr.require("结束时间"),
						  LIB.formRuleMgr.length()
				],
				"startDate" : [LIB.formRuleMgr.require("开始时间"),
						  LIB.formRuleMgr.length()
				],
				"checkDate" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"num" : [LIB.formRuleMgr.length()],
				"status" : [LIB.formRuleMgr.length()],
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
		isLateCheckAllowed : false // 过期后是否还可以执行
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
			"checktableSelectModal":checkTableSelectModal
        },
		props : ['msg'],
		data:function(){
			return dataModel;
		},
		watch : {
			//任务过期是否执行
			'msg' : function(newValue){
                this.isLateCheckAllowed = newValue;
			}
		},
		methods:{
			newVO : newVO,
			doSaveCheckPlan : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.checkPlan = selectedDatas[0];
				}
			},
			doSaveCheckTable : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.checkTable = selectedDatas[0];
				}
			},
			doMakeCheckRecord : function() {
				if(this.mainModel.vo.checkerId != LIB.user.id) {
                	LIB.Msg.warning("只能执行自己的任务");
                    return;
                }
				if(this.mainModel.vo.status === '0'){
					LIB.Msg.warning("当前任务未到时间，无法执行!");
                    return false;
				}
                if(this.mainModel.vo.status === '3'){
					LIB.Msg.warning("当前任务已完成，无法再次执行!");
                    return false;
				}
                if(this.mainModel.vo.status === '4' && !this.isLateCheckAllowed){
					LIB.Msg.warning("当前任务已过期，无法执行!");
                    return false;
				}

				LIB.asideMgr.hideAll();

				//TODO 以后改成用vuex做,暂时的解决方案
				window.isClickCheckTaskExecutBtn = true;

				var _this = this;
				setTimeout(function(){
					var routerPart="/hiddenDanger/businessCenter/checkRecord?method=check&checkTaskId="+_this.mainModel.vo.id;
					_this.$router.go(routerPart);
				}, 400);
			}
		},
		events : {
		},
		init: function () {
            this.$api = api;
        },
        ready: function(){
            this.isLateCheckAllowed = this.msg;
			this.enableCheckLevel = LIB.getBusinessSetByNamePath('common.enableCheckLevel').result === '2';
        }
	});

	return detail;
});