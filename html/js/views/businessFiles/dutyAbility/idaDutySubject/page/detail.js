define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var idaDutyAbilityFormModal = require("componentsEx/formModal/idaDutyAbilityFormModal");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//编码
			code : null,
			//分类名称
			name : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//公司id
			compId : null,
			//部门id
			orgId : null,
			//履职能力清单
			dutyAbilities : [],
			//人员
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
				"code" : [LIB.formRuleMgr.length(100)],
				"name" : [LIB.formRuleMgr.length(50)],
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
	        }
		},
		tableModel : {
			dutyAbilityTableModel : LIB.Opts.extendDetailTableOpt({
				url : "idadutysubject/dutyabilities/list/{curPage}/{pageSize}",
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
			userTableModel : LIB.Opts.extendDetailTableOpt({
				url : "idadutysubject/users/list/{curPage}/{pageSize}",
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
			dutyAbilityFormModel : {
				show : false,
				hiddenFields : ["dutySubjectId"],
				queryUrl : "idadutysubject/{id}/dutyability/{dutyAbilityId}"
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
			"idadutyabilityFormModal":idaDutyAbilityFormModal,
			"userSelectModal":userSelectModal,

        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowDutyAbilityFormModal4Update : function(param) {
				this.formModel.dutyAbilityFormModel.show = true;
				this.$refs.dutyabilityFormModal.init("update", {id: this.mainModel.vo.id, dutyAbilityId: param.entry.data.id});
			},
			doShowDutyAbilityFormModal4Create : function(param) {
				this.formModel.dutyAbilityFormModel.show = true;
				this.$refs.dutyabilityFormModal.init("create");
			},
			doSaveDutyAbility : function(data) {
				if (data) {
					var _this = this;
					api.saveDutyAbility({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.dutyabilityTable);
					});
				}
			},
			doUpdateDutyAbility : function(data) {
				if (data) {
					var _this = this;
					api.updateDutyAbility({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.dutyabilityTable);
					});
				}
			},
			doRemoveDutyAbility : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeDutyAbilities({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.dutyabilityTable.doRefresh();
						});
					}
				});
			},
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
				this.$refs.dutyabilityTable.doQuery({id : this.mainModel.vo.id});
				this.$refs.userTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.dutyabilityTable.doClearData();
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