define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var cloudFileSelectModal = require("componentsEx/selectTableModal/cloudFileSelectModal");
	var ptwWorkPermitSelectModal = require("componentsEx/selectTableModal/ptwWorkPermitSelectModal");
	var gasDetectionDetailFormModal = require("componentsEx/formModal/gasDetectionDetailFormModal");

	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//编码
			code : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//检测地点
			detectSite : null,
			//检测时间
			detectTime : null,
			//检测类型 1:作业前,2:作业中
			type : null,
			//签名
			cloudFile : {id:'', name:''},
			//作业许可
			workPermit : {id:'', name:''},
			//气体检测详情
			gasDetectionDetails : [],
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
				"code" : [LIB.formRuleMgr.length(255)],
				"disable" :LIB.formRuleMgr.require("状态"),
				"detectSite" : [LIB.formRuleMgr.length(200)],
				"detectTime" : [LIB.formRuleMgr.allowStrEmpty],
				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"cloudFile.id" : [LIB.formRuleMgr.allowStrEmpty],
				"workPermit.id" : [LIB.formRuleMgr.require("作业许可")],
	        }
		},
		tableModel : {
			gasDetectionDetailTableModel : LIB.Opts.extendDetailTableOpt({
				url : "gasdetectionrecord/gasdetectiondetails/list/{curPage}/{pageSize}",
				columns : [
					LIB.tableMgr.ksColumn.code,
				{
					title : "名称",
					fieldName : "name",
					keywordFilterName: "criteria.strValue.keyWordValue_name"
				},{
					title : "",
					fieldType : "tool",
					toolType : "edit,del"
				}]
			}),
		},
		formModel : {
			gasDetectionDetailFormModel : {
				show : false,
				hiddenFields : ["recordId"],
				queryUrl : "gasdetectionrecord/{id}/gasdetectiondetail/{gasDetectionDetailId}"
			},
		},
		selectModel : {
			cloudFileSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			workPermitSelectModel : {
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
			"cloudfileSelectModal":cloudFileSelectModal,
			"ptwworkpermitSelectModal":ptwWorkPermitSelectModal,
			"gasdetectiondetailFormModal":gasDetectionDetailFormModal,

        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowCloudFileSelectModal : function() {
				this.selectModel.cloudFileSelectModel.visible = true;
				//this.selectModel.cloudFileSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveCloudFile : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.cloudFile = selectedDatas[0];
				}
			},
			doShowWorkPermitSelectModal : function() {
				this.selectModel.workPermitSelectModel.visible = true;
				//this.selectModel.workPermitSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveWorkPermit : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.workPermit = selectedDatas[0];
				}
			},
			doShowGasDetectionDetailFormModal4Update : function(param) {
				this.formModel.gasDetectionDetailFormModel.show = true;
				this.$refs.gasdetectiondetailFormModal.init("update", {id: this.mainModel.vo.id, gasDetectionDetailId: param.entry.data.id});
			},
			doShowGasDetectionDetailFormModal4Create : function(param) {
				this.formModel.gasDetectionDetailFormModel.show = true;
				this.$refs.gasdetectiondetailFormModal.init("create");
			},
			doSaveGasDetectionDetail : function(data) {
				if (data) {
					var _this = this;
					api.saveGasDetectionDetail({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.gasdetectiondetailTable);
					});
				}
			},
			doUpdateGasDetectionDetail : function(data) {
				if (data) {
					var _this = this;
					api.updateGasDetectionDetail({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.gasdetectiondetailTable);
					});
				}
			},
			doRemoveGasDetectionDetail : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeGasDetectionDetails({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.gasdetectiondetailTable.doRefresh();
						});
					}
				});
			},
			afterInitData : function() {
				this.$refs.gasdetectiondetailTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.gasdetectiondetailTable.doClearData();
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