define(function (require) {
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");

	var companySelectModel = require("componentsEx/selectTableModal/companySelectModel");
	var multiInputSelect = require("componentsEx/multiInputSelector/main");
	var deptSelectModal = require("componentsEx/selectTableModal/deptSelectModal");
	//初始化数据模型
	var newVO = function () {
		return {
			id: null,
			//编码
			code: null,
			//所属公司id
			compId: null,
			//级别 1:站队级,2:管理处级,3:公司级
			positionLevel: null,
			//岗位 1:基层站队长,2:管理处机关业务人员,3:管理处机关科室长,4:管理处机关主管领导,5:公司业务处室业务人员,6:公司业务处室科室长,7:公司业务处室主管领导
			positionType: null,
			//审批形式 1:按站队,2:按公司,3:按专业
			relType: null,
			relId: null,
			type: null,
			//禁用标识 0:启用,1:禁用
			disable: "0",
			//人员
			user: { id: '', name: '' },
		}
	};
	//Vue数据
	var dataModel = {
		mainModel: {
			vo: newVO(),
			opType: 'view',
			isReadOnly: true,
			title: "",
			//showUserSelectModal : false,

			//验证规则
			rules: {
				// code : [LIB.formRuleMgr.require("权限编码"),
				// 	LIB.formRuleMgr.length()
				// ],
				name: [
					{ required: true, message: '请输入权限名称' },
				]
			},
			copyId: null,
			emptyRules: {}
		},
		tableModel: {
			userTableModel: {
				values: [],
				columns: [

					{
						title: "审批人",
						fieldName: "user.name",

						width: 100
					},
					// _.extend(_.clone(LIB.tableMgr.column.company), { filterType: null,width: 150 }),
					{
						title: "所属公司",
						fieldType: "custom",
						render: function(data) {
							if (data.user) {
								return LIB.tableMgr.rebuildOrgName(data.user.compId, 'comp');
							}
						},
						// filterType: "text",
						// filterName: "criteria.strValue.compName",
						fieldName: "compId",
						width: 240
					},
					{
						title: "所属部门",
						fieldType: "custom",
						render: function (data) {
							if (data.user) {
								return LIB.tableMgr.rebuildOrgName(data.user.orgId, 'dept');
							}
						},
						width: 150
					},
					{
						title: "负责的专业",
						render: function (data) {
							if (data.orgIds) {
								var str = ''
								_.each(data.orgIds, function (item) {
									str +=  LIB.getDataDic("ipec_profession",item)+','
									
								})
								return str.slice(0, str.length - 1)
							}
						},
						width: 250
					},
					{
						title: "",
						fieldType: "tool",
						toolType: "edit,del"
					}]
			},
			userTable: {
				values:[],
				columns: [
				
					// _.extend(_.clone(LIB.tableMgr.column.company), { filterType: null,title: "公司", }),
					{
						title: "所属公司",
						fieldType: "custom",
						render: function(data) {
							if (data.user) {
								return LIB.tableMgr.rebuildOrgName(data.user.compId, 'comp');
							}
						},
						// filterType: "text",
						// filterName: "criteria.strValue.compName",
						fieldName: "compId",
						width: 240
					},
					{
						title: "部门",
						fieldType: "custom",
						render: function (data) {
							if (data.user) {
								return LIB.tableMgr.rebuildOrgName(data.user.orgId, 'dept');
							}
						},
						width: 200
					},
					{
						title: "人员",
						fieldName: "user.name",
						keywordFilterName: "criteria.strValue.keyWordValue_name",
						width: 150
					},
					{
						title: "",
						fieldType: "tool",
						toolType: "del"
					}]
			},
			majorTableModel: {
				values: [],
				columns: [

					{
						title: "电气专业",
						render: function (data) {
							if (data.relId) {
								return LIB.getDataDic("ipec_profession",data.relId)
							}
						},
						width: 200
					},
					{
						title: "审批人",
						render: function (data) {
							if (data.users) {
								var str = ''
								_.each(data.users, function (item) {
									str += item.name + ','
								})
								return str.slice(0, str.length - 1)
							}

						},

						width: 300
					},

					{
						title: "",
						fieldType: "tool",
						toolType: "edit,del"
					}]
			},
		},

		formModel: {
		},
		selectModal: {
			show: false
		},
		selectModel: {
			userSelectModel: {
				visible: false,
				filterData: {
					compId: null,
					type: 0
				}
			},

		},
		companySelectModel: {
			filterData: null,
			list: [],
			num: 0,
			show: false
		},
		dependencyTreeModel: {
			visible: false,
			filterData: {}
		},

		copyModel: {
			visible: false,
			title: "复制",
			isNeedCopyUser: false
		},
		type: 0,
		users: [],
		majors: [],
		opType: '',
		profession: '',
		professions: []
	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	el
	 template
	 components
	 componentName
	 props
	 data
	 computed
	 watch
	 methods
	 events
	 vue组件声明周期方法
	 created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
		template: tpl,
		components: {
			"userSelectModal": userSelectModal,

			'companySelectModel': companySelectModel,
			'deptSelectModal': deptSelectModal,
			'multiInputSelect': multiInputSelect
		},
		data: function () {
			return dataModel;
		},
		watch: {
			'selectModal.show': function (val) {
				if (!val) {
					this.users = []
					this.professions = []
					this.profession =''
				}

			},
			'mainModel.vo.compId': function (val) {
				var _this = this;

				this.selectModel.userSelectModel.filterData.compId = val
				if (val) {
					if (this.mainModel.vo.type==2) {
						this.queryData()
					}else{
						this.queryUserData()
					}
					
				}
			}
		},
		methods: {
			afterInit:function(){
				this.tableModel.userTableModel.values =[]
				this.tableModel.majorTableModel.values =[]
				this.tableModel.userTable.values=[]
			},
			doSelectUser: function () {
				if (this.opType == 'update') {
					LIB.Msg.warning('编辑状态下不能修改审核人员')
					return
				}
				this.selectModel.userSelectModel.visible = true
			},
			doSelectmajor: function () {
				if (this.opType == 'update') {
					LIB.Msg.warning('编辑状态下不能修改专业')
					return
				}
				// this.majorSelectModel.visible = true

			},
			doEdit: function (data) {
				this.selectModal.show = true
				var _this = this
				this.opType = 'update'
				this.$refs.userSelect.customRemoveItem = true
				// this.$refs.majorSelect.customRemoveItem = true
				if (this.type == 0) {
					this.users = [data.entry.data.user]
					api.queryAuditRoles({  positionType:  this.mainModel.vo.type, 'user.id': this.users[0].id, compId: _this.mainModel.vo.compId,}).then(function (res) {
						_.each(res.data,function(item){
							_this.professions.push(item.relId)
						})
						
					})
				} else {
					this.profession = data.entry.data.relId
					api.queryAuditRoles({ relId: this.profession, relType: 3,  positionType:  this.mainModel.vo.type }).then(function (res) {
						_.each(res.data,function(item){
							_this.users.push(item.user)
						})
					})
				}
			},
			doAddmajorUser: function () {
				if (!this.profession) {
					LIB.Msg.warning('请先选择专业')

					return
				}
				this.opType = 'create'

				this.selectModel.userSelectModel.visible = true
			},
			doAdduser1: function () {
				if (this.mainModel.vo.compId == null) {
					LIB.Msg.warning('请先选公司')
					return
				}
			
				this.selectModel.userSelectModel.visible=true
			},

			doAdduser: function () {
				if (this.mainModel.vo.compId == null) {
					LIB.Msg.warning('请先选公司')
					return
				}
				this.opType = 'create'
				this.$refs.userSelect.customRemoveItem = false
				this.$refs.majorSelect.customRemoveItem = false
				this.selectModal.show = true
			},
			initData: function (param, transferVO) {
				var _this = this;
				function setDataAfter(data) {
					_this.storeBeforeEditVo();
					_this.afterInitData && _this.afterInitData(transferVO);
					_this.$broadcast('init-card-filter');
				}
				setDataAfter(_this.mainModel.vo);
				_this.mainModel.vo.compId = null
				_this.mainModel.vo.type = transferVO.type

			},
			newVO: newVO,
			doShowUserSelectModel: function () {
				this.selectModel.userSelectModel.visible = true;
				this.selectModel.userSelectModel.filterData = { compId: this.mainModel.vo.compId, type: 0 };
			},
			doSaveCompany: function (val) {
				var _this = this;
				if (!this.companySelectModel.list) {
					this.companySelectModel.list = [];
				}
				_.each(val, function (item) {
					var obj = _.pick(item, ["id", "name"]);
					_this.companySelectModel.list.push(obj);
				});

			},
			doSaveUsers: function (selectedDatas) {
				var _this = this
					if (this.mainModel.vo.type==2) {
						this.users = selectedDatas;
					}else{
						var data = _.map(selectedDatas,function(item){
							return {
								relType: 2,
								relId: _this.mainModel.vo.compId,
								positionType: _this.mainModel.vo.type,
								compId: _this.mainModel.vo.compId,
								user: { id: item.id }
							}
						})
						
						api.saveAuditRoles({  type: _this.mainModel.vo.type }, data).then(function (res) {
	
							_this.selectModel.userSelectModel.visible = false
							_this.queryUserData()
						})
					}
						
					
				

			},
			doSaveData: function () {
				var _this = this
				if (this.opType == 'create') {
					if (this.type == 0) {
						if (this.professions.length == 0 || this.users.length == 0) {
							LIB.Msg.warning('保存失效，请选择专业或人员')
							return
						}
					   var data =	_.map(this.professions, function (item) {
						   
							return {
								relType: 3,
								relId: item,
								positionType: _this.mainModel.vo.type,
								compId:_this.mainModel.vo.compId,
								user: { id: _this.users[0].id }
							}
						})
						api.saveAuditRoles({ type: this.mainModel.vo.type },data).then(function (res) {

							_this.selectModal.show = false
							_this.queryData()
						})
					} else {
						
						if (!this.profession || this.users.length == 0) {
							LIB.Msg.warning('保存失效，请选择专业或人员')
							return
						}
						var data =	_.map(this.users, function (item) {
							return {
								relType: 3,
								relId:_this.profession,
								positionType: _this.mainModel.vo.type,
								compId: _this.mainModel.vo.compId,
								user: { id:  item.id }
							}
						})
						api.saveAuditRoles({ type: this.mainModel.vo.type }, data).then(function (res) {

							_this.selectModal.show = false
							_this.queryData()
						})
					}
				} else {
					if (this.type == 0) {
						if (this.professions.length == 0 || this.users.length == 0) {
							LIB.Msg.warning('保存失效，请选择专业或人员')
							return
						}
						var data =	_.map(this.professions, function (item) {
						   
							return {
								relType: 3,
								relId: item,
								positionType: _this.mainModel.vo.type,
								compId: _this.mainModel.vo.compId,
								user: { id: _this.users[0].id }
							}
						})
					
						api.updateAuditRoles({ type: this.mainModel.vo.type, mode: 1 },data).then(function (res) {

							_this.selectModal.show = false
							_this.queryData()
						})
					} else {
						if (!this.profession || this.users.length == 0) {
							LIB.Msg.warning('保存失效，请选择专业或人员')
							return
						}
						var data =	_.map(this.users, function (item) {
							return {
								relType: 3,
								relId:_this.profession,
								positionType: _this.mainModel.vo.type,
								compId: _this.mainModel.vo.compId,
								user: { id:  item.id }
							}
						})
						api.updateAuditRoles({  type: this.mainModel.vo.type, mode: 2 }, data).then(function (res) {

							_this.selectModal.show = false
							_this.queryData()
						})
					}
				}


			},
			doSavemajors: function (selectedDatas) {
				var _this = this
				if (this.type == 0) {

					// _.each(selectedDatas, function (item) {
					// 	_this.majorTable.values.push({
					// 		relType: 3,
					// 		relId: item.id,
					// 		positionType: _this.mainModel.vo.type,
					// 		compId: item.compId,
					// 		user: { id: _this.users[0].id }
					// 	})
					// })


				} else {
					if (selectedDatas) {

						// var isCheck = false
						// _.each(_this.tableModel.majorTableModel.values, function (item) {
						// 	if (item.relId == selectedDatas[0].id) {
						// 		isCheck = true
						// 		return false
						// 	}
						// })
						// if (isCheck) {
						// 	LIB.Msg.warning('该专业已存在，无需添加')
						// } else {
						// 	this.majors = selectedDatas;
						// }

					}
				}
			},
			doRemoveUsers:function(data){
				var _this = this;
                var data = data.entry.data;
				api.removePecAuditRoles({  type: _this.mainModel.vo.type }, { 'user': { id: data.user.id }, compId: _this.mainModel.vo.compId }).then(function () {
					LIB.Msg.info("删除成功！");
					_this.queryUserData()
				});
			},
			doRemove: function (item) {
				var _this = this;
				var data = item.entry.data;
				if (this.type == 0) {
					api.removePecAuditRoles({  type: this.mainModel.vo.type }, { 'user': { id: data.user.id }, compId: _this.mainModel.vo.compId }).then(function () {
						LIB.Msg.info("删除成功！");
						_this.queryData()
					});
				} else {
					api.removePecAuditRoles({  type: this.mainModel.vo.type }, { relId: data.relId, relType: data.relType, compId: _this.mainModel.vo.compId }).then(function () {
						LIB.Msg.info("删除成功！");
						_this.queryData()
					});

				}

			},
			queryUserData:function(){
				var _this = this;
				api.queryAuditRoles({ compId: _this.mainModel.vo.compId, positionType:_this.mainModel.vo.type }).then(function (res) {
					var data = _.clone(res.data)
				
					_this.tableModel.userTable.values = data
					var excludeIds = [];
					if(res.data.length > 0){
						excludeIds = _.map(res.data,"user.id");
					}
					_this.selectModel.userSelectModel.filterData = {"criteria.strsValue": JSON.stringify({excludeIds: excludeIds})};
				

				})
			},
			queryData: function () {
				var _this = this;
				api.queryAuditRoles({ compId: _this.mainModel.vo.compId, positionType:_this.mainModel.vo.type }).then(function (res) {
					var data = _.clone(res.data)
					var arr = []

					var groupList = _.groupBy(data, "user.id");
					for (k in groupList) {
						var orgIds = []
						_.each(groupList[k], function (item) {
							orgIds.push(item.relId)
						})

						var list = _.clone(groupList[k][0])
						list.orgIds = orgIds
						arr.push(list)
					}
				
					_this.tableModel.userTableModel.values = arr
					var excludeIds = [];
					if(res.data.length > 0){
						excludeIds = _.map(res.data,"user.id");
					}
					_this.selectModel.userSelectModel.filterData = {"criteria.strsValue": JSON.stringify({excludeIds: excludeIds})};
					var arr1 = []
					var groupList1 = _.groupBy(data, "relId")
					for (k in groupList1) {
						var users = []
						_.each(groupList1[k], function (item) {
							users.push(item.user)
						})
						var list = _.clone(groupList1[k][0])
						list.users = users
						arr1.push(list)
					}
					_this.tableModel.majorTableModel.values = arr1

				})
			},
			afterInitData: function () {
				if (LIB.user.compId) {
					this.mainModel.vo.compId = LIB.user.compId
				}
				if (this.mainModel.vo.type>2) {
					this.type=0
				}

			},


		},
		events: {

		},
		init: function () {
			this.$api = api;
		}
	});

	return detail;
});