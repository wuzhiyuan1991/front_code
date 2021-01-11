define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编号
			code : null,
			//禁用标识 0未禁用,1已禁用
			disable : "0",
			//安全管理部门意见
			deptAdvice : null,
			//安全措施
			measure : null,
			//作业地点
			workAddress : null,
			//直接作业人员
			mainWorkerName : null,
			//分管领导意见
			leaderAdvice : null,
			//现场指挥人员
			commanderName : null,
			//现场监护人员
			guardianName : null,
			//部门负责人
			ownerName : null,
			//作业内容
			content : null,
			//作业类型
			type : null,
			//辅助作业人员
			subWorkerName : null,
			//所属公司
			compId : null,
			//所属部门
			orgId : null,
			//作业结束日期
			endDate : null,
			//作业开始日期
			startDate : null,
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
				"code" : [LIB.formRuleMgr.require("编号"),
						  LIB.formRuleMgr.length(200)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"deptAdvice" : [LIB.formRuleMgr.require("安全管理部门意见"),
						  LIB.formRuleMgr.length(300)
				],
				"measure" : [LIB.formRuleMgr.require("安全措施"),
						  LIB.formRuleMgr.length(300)
				],
				"workAddress" : [LIB.formRuleMgr.require("作业地点"),
						  LIB.formRuleMgr.length(100)
				],
				"mainWorkerName" : [LIB.formRuleMgr.require("直接作业人员"),
						  LIB.formRuleMgr.length(100)
				],
				"leaderAdvice" : [LIB.formRuleMgr.require("分管领导意见"),
						  LIB.formRuleMgr.length(300)
				],
				"commanderName" : [LIB.formRuleMgr.require("现场指挥人员"),
						  LIB.formRuleMgr.length(100)
				],
				"guardianName" : [LIB.formRuleMgr.require("现场监护人员"),
						  LIB.formRuleMgr.length(100)
				],
				"ownerName" : [LIB.formRuleMgr.require("部门负责人"),
						  LIB.formRuleMgr.length(100)
				],
				"content" : [LIB.formRuleMgr.require("作业内容"),
						  LIB.formRuleMgr.length(65535)
				],
				"type" : [LIB.formRuleMgr.require("作业类型"),
						  LIB.formRuleMgr.length(100)
				],
				"subWorkerName" : [LIB.formRuleMgr.require("辅助作业人员"),
						  LIB.formRuleMgr.length(100)
				],
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"endDate" : [LIB.formRuleMgr.allowStrEmpty],
				"startDate" : [LIB.formRuleMgr.allowStrEmpty],
	        }
		},


//无需附件上传请删除此段代码
/*
		fileModel:{
			file : {
				cfg: {
					params: {
						recordId: null,
						dataType: 'XXX1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					},
					filters: {
						max_file_size: '10mb',
					},
				},
				data : []
			},
			pic : {
				cfg: {
					params: {
						recordId: null,
						dataType: 'XXX2', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					},
					filters: {
						max_file_size: '10mb',
						mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
					}
				},
				data : []
			},
			video : {
				cfg: {
					params: {
						recordId: null,
						dataType: 'XXX3', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					},
					filters: {
						max_file_size: '10mb',
						mime_types: [{title: "files", extensions: "mp4,avi,flv,3gp"}]
					}
				},
				data : []
			}
		}
*/


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
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,

		},
		events : {
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});