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
			//编号
			code : null,
			//设备/工艺/工序
			name : null,
			//禁用标识 0:未禁用,1:已禁用
			disable : "0",
			//所属公司
			compId : null,
			//所属部门
			orgId : null,
			//可能导致的职业病
			diseases : null,
			//危害因素
			factors : null,
			//种类
			factorsType : null,
			//资金投入
			invest : null,
			//防护设施及用品
			protectFac : null,
			//接触人员
			users : [],
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
				"name" : [LIB.formRuleMgr.require("设备/工艺/工序"),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"diseases" : [LIB.formRuleMgr.length(100)],
				"factors" : [LIB.formRuleMgr.length(100)],
				"factorsType" : [LIB.formRuleMgr.length(100)],
				"invest" : LIB.formRuleMgr.range(1, 100, 2).concat(LIB.formRuleMgr.allowIntEmpty),
				"protectFac" : [LIB.formRuleMgr.length(100)],
	        }
		},
		tableModel : {
			userTableModel : LIB.Opts.extendDetailTableOpt({
				url : "ltohhazards/users/list/{curPage}/{pageSize}",
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
		cardModel : {
			userCardModel : {
				showContent : true
			},
		},
		selectModel : {
			userSelectModel : {
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
			doSaveUsers : function(selectedDatas) {
				if (selectedDatas) {
					dataModel.mainModel.vo.users = selectedDatas;
					var param = _.map(selectedDatas, function(data){return {id : data.id}});
					var _this = this;
					api.saveUsers({id : dataModel.mainModel.vo.id}, param).then(function() {
						_this.refreshTableData(_this.$refs.userTable);
					});
				}
			},
			doRemoveUser : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeUsers({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.userTable.doRefresh();
						});
					}
				});
			},
			afterInitData : function() {
				this.$refs.userTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.userTable.doClearData();
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