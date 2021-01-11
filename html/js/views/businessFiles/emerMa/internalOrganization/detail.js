define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//编码
			code : null,
			//应急职务
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//安全角色类别 1:应急管理
			hseType : 1,
			//岗位类型 0:普通岗位,1:安全角色
			postType : 1,
			//应急职责
			remarks : null,
			orgId: LIB.user.compId,
			compId: LIB.user.compId,
			//应急组别
			emerGroup : {id: null, name: null},
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
				"name" : [LIB.formRuleMgr.require("应急职务"), LIB.formRuleMgr.length(100)],
				"emerGroup.id" : [LIB.formRuleMgr.require("应急组别")],
				"remarks" : [LIB.formRuleMgr.length(500)],
	        }
		},
		tableModel : {
			userTableModel : LIB.Opts.extendDetailTableOpt({
				url : "emerposition/users/list/{curPage}/{pageSize}",
				columns : [
					{
						title : "人员姓名",
						fieldName : "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					},
					{
						title: "岗位",
						fieldType: "custom",
						render: function (data) {
							if (_.propertyOf(data)("positionList")) {
								var posNames = "";
								data.positionList.forEach(function (e) {
									if (e.postType == 0) {
										posNames += (e.name + ",");
									}
								});
								posNames = posNames.substr(0, posNames.length - 1);
								return posNames;

							}
						},
						keywordFilterName: "criteria.strValue.keyWordValue_position"
					},
					// {
					// 	title: "所属公司",
					// 	fieldType: "custom",
					// 	render: function (data) {
					// 		if (data.compId) {
					// 			return LIB.getDataDic("org", data.compId)["compName"];
					// 		}
					// 	},
					// 	keywordFilterName: "criteria.strValue.keyWordValue_comp"
					// },
					{
                        title: "联系电话",
                        fieldName : "mobile",
                        keywordFilterName: "criteria.strValue.keyWordValue_mobile"
					},
					{
						title: "所属部门",
						fieldType: "custom",
						render: function (data) {
							if (data.orgId) {
								return LIB.getDataDic("org", data.orgId)["deptName"];
							}
						},
						keywordFilterName: "criteria.strValue.keyWordValue_org"
					},{
						title : "",
						fieldType : "tool",
						toolType : "del"
					}]
			}),
		},
		selectModel : {
			userSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

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
		props: {
			groupId: {
				type: String,
				default: ''
			},
			emerGroups: {
				type: Array,
				default: []
			}
		},
		data:function(){
			return dataModel;
		},
		watch: {
			'mainModel.vo.emerGroup.id': function(val) {
				var group = _.find(this.emerGroups, function(item){return item.id == val});
				_.deepExtend(this.mainModel.vo.emerGroup, group);
			}
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
						_this.$dispatch("ev_dtUpdate");
					});
				}
			},
			doRemoveUsers : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeUsers({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.userTable.doRefresh();
					_this.$dispatch("ev_dtUpdate");
				});
			},
			afterInitData : function() {
				this.$refs.userTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.userTable.doClearData();
			},
			afterInit: function () {
				var _this = this;
				if(this.mainModel.opType == 'create') {
					this.mainModel.vo.emerGroup = _.clone(_.find(this.emerGroups, function(group){ return group.id == _this.groupId}));
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