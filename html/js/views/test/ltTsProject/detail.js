define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");

	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//编号
			code : null,
			//项目名称
			name : null,
			//建设单位负责人
			constructionOwnerName : null,
			//禁用标识 0:未禁用,1:已禁用
			disable : "0",
			//施工单位负责人
			builderOwnerName : null,
			//施工单位
			builderName : null,
			//建设单位负责人联系电话
			constructionOwnerMobile : null,
			//监管单位负责人联系电话
			supervisionOwnerMobile : null,
			//施工单位负责人联系电话
			builderOwnerMobile : null,
			//监管单位负责人
			supervisionOwnerName : null,
			//建设单位
			constructionName : null,
			//项目负责人
			ownerName : null,
			//监管单位
			supervisionName : null,
			//所属公司
			compId : null,
			//所属部门
			orgId : null,
			//申请日期
			applyDate : null,
			//批准日期
			approveDate : null,
			//预计完成日期
			jobEndDate : null,
			//开工日期
			jobStartDate : null,
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
				"name" : [LIB.formRuleMgr.require("项目名称"),
						  LIB.formRuleMgr.length(100)
				],
				"constructionOwnerName" : [LIB.formRuleMgr.require("建设单位负责人"),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"builderOwnerName" : [LIB.formRuleMgr.require("施工单位负责人"),
						  LIB.formRuleMgr.length(100)
				],
				"builderName" : [LIB.formRuleMgr.require("施工单位"),
						  LIB.formRuleMgr.length(200)
				],
				"constructionOwnerMobile" : [LIB.formRuleMgr.require("建设单位负责人联系电话"),
						  LIB.formRuleMgr.length(100)
				],
				"supervisionOwnerMobile" : [LIB.formRuleMgr.require("监管单位负责人联系电话"),
						  LIB.formRuleMgr.length(100)
				],
				"builderOwnerMobile" : [LIB.formRuleMgr.require("施工单位负责人联系电话"),
						  LIB.formRuleMgr.length(100)
				],
				"supervisionOwnerName" : [LIB.formRuleMgr.require("监管单位负责人"),
						  LIB.formRuleMgr.length(100)
				],
				"constructionName" : [LIB.formRuleMgr.require("建设单位"),
						  LIB.formRuleMgr.length(200)
				],
				"ownerName" : [LIB.formRuleMgr.require("项目负责人"),
						  LIB.formRuleMgr.length(100)
				],
				"supervisionName" : [LIB.formRuleMgr.require("监管单位"),
						  LIB.formRuleMgr.length(200)
				],
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"applyDate" : [LIB.formRuleMgr.allowStrEmpty],
				"approveDate" : [LIB.formRuleMgr.allowStrEmpty],
				"jobEndDate" : [LIB.formRuleMgr.allowStrEmpty],
				"jobStartDate" : [LIB.formRuleMgr.allowStrEmpty],
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