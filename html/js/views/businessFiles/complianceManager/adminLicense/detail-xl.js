define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var adminLicenseProcessFormModal = require("./dialog/adminLicenseProcessFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//角色编码
			code : null,
			//许可名称
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//
			compId : null,
			//
			orgId : null,
			//许可（适用）对象
			applicable : null,
			//许可证件 1:许可证/执照,2:资格证/资质证,3:批准文件/证明文件,10:其它行政许可证件
			cert : null,
			//许可内容
			content : null,
			//许可截止日期
			endDate : null,
			//许可机关
			government : null,
			//许可文号
			number : null,
			//许可决定日期
			startDate : null,
			//状态 1:初次申请,2:变更申请,3:延续申请,4:审查,5:批复,6:修订,7:废弃,10:其他
			status : null,
			//类别 1:普通,2:特许,3:认可,4:核准,5:登记,10:其他
			type : null,
			//行政许可过程管理
			adminLicenseProcesses : [],
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
				// "code" : [LIB.formRuleMgr.length(100)],
				"name" : [LIB.formRuleMgr.require("许可名称"),LIB.formRuleMgr.length(100)],
				"number" : [LIB.formRuleMgr.require("许可文号"),LIB.formRuleMgr.length(100)],
				"type" : [LIB.formRuleMgr.require("许可类别")],
				"cert" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"startDate" : [LIB.formRuleMgr.require("许可决定日期")],
				"endDate" : [LIB.formRuleMgr.require("许可截止日期")],
				"government" : [LIB.formRuleMgr.length(200)],
				"applicable" : [LIB.formRuleMgr.require("许可（适用）对象"),LIB.formRuleMgr.length(100)],
				"content" : [LIB.formRuleMgr.length(500)],
				"status" : [LIB.formRuleMgr.require("状态")],
				// "disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				// "orgId" : [LIB.formRuleMgr.length(10)],
	        }
		},
		tableModel : {
			adminLicenseProcessTableModel : LIB.Opts.extendDetailTableOpt({
				url : "adminlicense/adminlicenseprocesses/list/{curPage}/{pageSize}",
				columns : [
					// LIB.tableMgr.ksColumn.code,
					{
						title:'',
						fieldType:"sequence",
						width: '60px'
					},
					{
						title : "操作",
						fieldName : "operate",
						keywordFilterName: "criteria.strValue.keyWordValue_operate",
						fieldType: "custom",
						render: function (data) {
							return LIB.getDataDic("icm_admin_lic_process_operate", data.operate);
						},
						width: '120px'
					},
					{
						title : "内容",
						fieldName : "content",
						keywordFilterName: "criteria.strValue.keyWordValue_content",
					},
					{
						title : "操作时间",
						fieldName : "operateDate",
						keywordFilterName: "criteria.strValue.keyWordValue_operateDate",
						width: '100px',
						render: function (data) {
							// if(!row.modifyDate || !row.modifyDate.length) { return ''  }
							// return row.modifyDate.split(' ')[0]
							return LIB.formatYMD(data.operateDate);
						}
					},
					{
						title : "附件",
						fieldName : "cloudFiles",
						width: '300px',
						render: function (row) {
							if (!row.cloudFiles || !row.cloudFiles.length) return ''
							return _.map(row.cloudFiles, function (fileItem) {
								return "<a class=\"file-items\"  onClick=\"window.open('\/file\/down\/"+ fileItem.id + "','_blank')\">" + fileItem.orginalName + "</a>"
							}).join('')
							
						},
						tipRender: function (row) {
							if (!row.cloudFiles || !row.cloudFiles.length) return ''
							return _.map(row.cloudFiles, function (fileItem) {
								return fileItem.orginalName
							}).join(',')
						},
						renderClass: 'coloud-file-list',
					},
					{
						title : "",
						fieldType : "tool",
						toolType : "edit,del",
						width: '80px'
					}
				]
			}),
		},
		formModel : {
			adminLicenseProcessFormModel : {
				show : false,
				hiddenFields : ["adminLicId"],
				queryUrl : "adminlicense/{id}/adminlicenseprocess/{adminLicenseProcessId}"
			},
		},
		cardModel : {
			adminLicenseProcessCardModel : {
				showContent : true
			},
		},
		selectModel : {
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
			"adminlicenseprocessFormModal":adminLicenseProcessFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			doComptime: function (beginTime, endTime) {
                var beginTimes = beginTime.substring(0, 10).split('-');
                var endTimes = endTime.substring(0, 10).split('-');
                beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 19);
                endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);
                var time = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
                return time;
            },
			newVO : newVO,
			doShowAdminLicenseProcessFormModal4Update : function(param) {
				this.formModel.adminLicenseProcessFormModel.show = true;
				this.$refs.adminlicenseprocessFormModal.init("update", {id: this.mainModel.vo.id, adminLicenseProcessId: param.entry.data.id});
			},
			doShowAdminLicenseProcessFormModal4Create : function(param) {
				this.formModel.adminLicenseProcessFormModel.show = true;
				this.$refs.adminlicenseprocessFormModal.init("create");
			},
			doSaveAdminLicenseProcess : function(data) {
				if (data) {
					var _this = this;
					api.saveAdminLicenseProcess({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.adminlicenseprocessTable);
					});
				}
			},
			doUpdateAdminLicenseProcess : function(data) {
				if (data) {
					var _this = this;
					api.updateAdminLicenseProcess({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.adminlicenseprocessTable);
					});
				}
			},
			doRemoveAdminLicenseProcess : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeAdminLicenseProcesses({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.adminlicenseprocessTable.doRefresh();
						});
					}
				});
			},
			afterInitData : function() {
				this.$refs.adminlicenseprocessTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.adminlicenseprocessTable.doClearData();
			},
			beforeDoSave: function () {
				
				this.mainModel.vo.orgId = LIB.user.compId;
					if (!this.mainModel.vo.startDate||!this.mainModel.vo.endDate) {
						return
					}
                    var examStarTime = this.doComptime(this.mainModel.vo.startDate, this.mainModel.vo.endDate);
                    if (examStarTime < 0) {
                        LIB.Msg.warning("许可截止时间不能小于许可决定时间");
                        return false;
                    }
                    
                    
                
			},
			doClickDownload: function () {
			
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