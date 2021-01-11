define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var contractorSelectModal = require("componentsEx/selectTableModal/contractorSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编码
			code : null,
			//姓名
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//年龄
			age : null,
			//证书
			certificate : null,
			//证书编号
			certificateNo : null,
			//身份证号
			idNumber : null,
			//备注
			remark : null,
			//性别
			sex : null,
			//联系电话
			telephone : null,
			//工种
			workType : null,
			//承包商
			contractor : {id:'', name:''},
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
				"code" : [LIB.formRuleMgr.length(100)],
				"name" : [LIB.formRuleMgr.length(100)],
				"disable" :LIB.formRuleMgr.require("状态"),
				"age" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"certificate" : [LIB.formRuleMgr.length(100)],
				"certificateNo" : [LIB.formRuleMgr.length(100)],
				"idNumber" : [LIB.formRuleMgr.length(100)],
				"remark" : [LIB.formRuleMgr.length(500)],
				"sex" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"telephone" : [LIB.formRuleMgr.length(100)],
				"workType" : [LIB.formRuleMgr.length(100)],
				"contractor.id" : [LIB.formRuleMgr.allowStrEmpty],
	        }
		},
		tableModel : {
		},
		formModel : {
		},
		cardModel : {
		},
		selectModel : {
			contractorSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
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
			"contractorSelectModal":contractorSelectModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowContractorSelectModal : function() {
				this.selectModel.contractorSelectModel.visible = true;
				//this.selectModel.contractorSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveContractor : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.contractor = selectedDatas[0];
				}
			},

		},
		events : {
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});