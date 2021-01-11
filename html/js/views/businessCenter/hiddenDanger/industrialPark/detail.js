define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//编码
			code : null,
			//园区名称
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//公司id
			compId : null,
			//部门id
			orgId : null,
			//坐标
			location : null,
			//备注
			remark : null,
			//属地
			dominationAreas : [],

			fileList:[],
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
				"name" : [LIB.formRuleMgr.require("园区名称"),
						  LIB.formRuleMgr.length(500)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("公司")],
				"orgId" : [LIB.formRuleMgr.require("部门"),
						  LIB.formRuleMgr.length(10)
				],
				"location" : [LIB.formRuleMgr.require("坐标"),LIB.formRuleMgr.length(100)],
				"remark" : [LIB.formRuleMgr.length(65535)],
				"fileList" : [
					{
						required: true,
						validator: function (rule, value, callback) {
							if (value.length > 0) {
								return callback();
							} else {
								return callback(new Error("请上传图片"));
							}
						}
					}
				]
	        }
		},
		tableModel : {
			dominationAreaTableModel : LIB.Opts.extendDetailTableOpt({
				url : "industrialpark/dominationareas/list/{curPage}/{pageSize}",
				columns : [
					LIB.tableMgr.ksColumn.code,
				{
					title : "名称",
					fieldName : "name",
					keywordFilterName: "criteria.strValue.keyWordValue_name"
				},{
					title : "",
					fieldType : "tool",
					toolType : "del"
				}]
			}),
		},
		formModel : {
		},
		selectModel : {
			dominationAreaSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},
		uploadModel: {
			params: {
				recordId: null,
				dataType: 'YQ1',
				fileType: ''
			},
			filters: {
				max_file_size: '10mb',
				mime_types: [{ title: "files", extensions: "jpg,jpeg,png"}]
			},
			// url: "/riskjudgmentunit/importExcel",
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
			"dominationareaSelectModal":dominationAreaSelectModal,

        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowDominationAreaSelectModal : function() {
				this.selectModel.dominationAreaSelectModel.visible = true;
				//this.selectModel.dominationAreaSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveDominationAreas : function(selectedDatas) {
				if (selectedDatas) {
					dataModel.mainModel.vo.dominationAreas = selectedDatas;
					var param = _.map(selectedDatas, function(data){return {id : data.id}});
					var _this = this;
					api.saveDominationAreas({id : dataModel.mainModel.vo.id}, param).then(function() {
						_this.refreshTableData(_this.$refs.dominationareaTable);
					});
				}
			},
			doRemoveDominationArea : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeDominationAreas({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.dominationareaTable.doRefresh();
						});
					}
				});
			},
			getFileList:function(id){
				var _this = this;
				api.getFileList({recordId:id}).then(function (res) {
					 _this.mainModel.vo.fileList = res.data;
				})
			},
			afterInitData : function() {
				if(this.mainModel.vo.id){
					this.$refs.dominationareaTable.doQuery({id : this.mainModel.vo.id});
					this.getFileList(this.mainModel.vo.id)  ;
				}
			},
			beforeInit : function() {
				this.$refs.dominationareaTable.doClearData();
				this.mainModel.vo.fileList = [];
			},
			doClickFile: function (index) {
				var files = this.mainModel.vo.fileList;
				var file = files[index];
				window.open("/file/down/" + file.id)
			},
			removeFile: function (fileId, index) {
				var _this = this;
				LIB.Modal.confirm({
					title: "确定删除文件？",
					onOk: function() {
						api.deleteFile(null, [fileId]).then(function () {
							_this.mainModel.vo.fileList.splice(index, 1);
						})
					}
				});
			},
			uploadClicked: function () {
				this.uploadModel.params.recordId = this.mainModel.vo.id;
				this.$refs.uploader.$el.firstElementChild.click();
			},
			doUploadSuccess: function (param) {
				var con = param.rs.content;
				this.mainModel.vo.fileList.push(con);
			},
			onUploadComplete: function () {
				LIB.globalLoader.hide();
			},
			afterInit:function () {
				var _vo = this.mainModel.vo;
				if (this.mainModel.opType === 'create') {
					api.getUUID().then(function (res) {
						_vo.id = res.data;
						_this.uploadModel.params.recordId = res.data;
					})
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