define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编码
			code : null,
			//计划名
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//结束时间
			endDate : null,
			//开始时间
			startDate : null,
			//备注
			remarks : null,
			//创建人
			user : {id:'', name:''},
            compId: null,
            orgId: null,
			createUserId:null,
			type : 0,
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			
			//验证规则
	        rules:{
                "compId": [{required: true, message: '请选择所属公司'}, LIB.formRuleMgr.length()],
                "orgId": [{required: true, message: '请选择所属部门'}, LIB.formRuleMgr.length()],
				"code" : [LIB.formRuleMgr.length(100)],
				"name" : [LIB.formRuleMgr.require("计划名"),
						  LIB.formRuleMgr.length(50)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"endDate" : [LIB.formRuleMgr.require("结束时间")],
				"startDate" : [LIB.formRuleMgr.require("开始时间")],
				"remarks" : [LIB.formRuleMgr.length(500)],
				"user.id" : [LIB.formRuleMgr.require("创建人")],
	        }
		},
		tableModel : {
		},
		formModel : {
		},
		cardModel : {
		},
		selectModel : {
			userSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},
        showUserSelectModal:false,

        //无需附件上传请删除此段代码
		fileModel: {
            default: {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'WP1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
                        fileType: 'WP'    // 文件类型标识，需要根据数据库的注释进行对应的修改
                    }
                },
                data: []
            }
        }
	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	 el
		 template
		 components
		 componentName
		 props
		 data
		 computed
		 watch
		 methods
			 _XXX    			//内部方法
			 doXXX 				//事件响应方法
			 beforeInit 		//初始化之前回调
			 afterInit			//初始化之后回调
			 afterInitData		//请求 查询 接口后回调
			 afterInitFileData  //请求 查询文件列表 接口后回调
			 beforeDoSave		//请求 新增/更新 接口前回调，返回false时不进行保存操作
			 afterFormValidate	//表单rule的校验通过后回调，，返回false时不进行保存操作
			 buildSaveData		//请求 新增/更新 接口前回调，重新构造接口的参数
			 afterDoSave		//请求 新增/更新 接口后回调
			 beforeDoDelete		//请求 删除 接口前回调
			 afterDoDelete		//请求 删除 接口后回调
		 events
		 vue组件声明周期方法
		 init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {
			"userSelectModal":userSelectModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowUserSelectModal : function() {
				this.selectModel.userSelectModel.visible = true;
				//this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveUser : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.user = selectedDatas[0];
                    this.mainModel.vo.createUserId = selectedDatas[0].id;
				}
			},
			afterInit: function () {
				if (this.mainModel.opType === 'create') {
					this.mainModel.vo.user = {
						id: LIB.user.id,
						name: LIB.user.name
					};
					this.mainModel.vo.createUserId = LIB.user.id;
                }
            }
		},
		events : {
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});