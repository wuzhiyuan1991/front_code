define(function (require) {
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var projThrSimultaneousTaskFormModal = require("./dialog/projThrSimultaneousTaskFormModal");
	var projThrSimultaneousTaskDetailFormModal = require("./dialog/projThrSimultaneousTaskDetailFormModal");

	//初始化数据模型
	var newVO = function () {
		return {
			id: null,
			//角色编码
			code: null,
			//项目名称
			name: null,
			//禁用标识 0未禁用，1已禁用
			disable: "0",
			//
			compId: null,
			//
			orgId: null,
			//项目建设单位
			buildDept: null,
			//项目简述
			description: null,
			//项目设计单位
			designDept: null,
			//项目完成时间
			endDate: null,
			//项目总包单位
			headDept: null,
			//项目管理单位
			manageDept: null,
			//项目性质 1:新建项目,2:扩建项目,3:改建项目,4:迁建项目,5:恢复项目,6:技术改造,7:技术引进
			nature: null,
			//项目业主
			owner: null,
			//项目阶段 1:可行性研究,2:项目立项,3:初步设计,4:详细设计,5:施工建设,6:试生产
			phase: null,
			//项目计划完成时间
			planEndDate: null,
			//项目计划启动时间
			planStartDate: null,
			//项目实际完成时间
			realEndDate: null,
			//项目实际启动时间
			realStartDate: null,
			//备注
			remark: null,
			//项目启动时间
			startDate: null,
			//项目监理单位
			superviseDept: null,
			//三同时任务
			projThrSimultaneousTasks: [],
		}
	};
	var taskVo = function () {
		return {
			id: null,
			//角色编码
			code: null,
			//类型 1:职业病防护,2:安全防护,3:防火防护,4:环境防护
			type: null,
			//禁用标识 0未禁用，1已禁用
			disable: "0",
			//
			compId: null,
			//
			orgId: null,
			//政府审查性质 1:许可,2:备案
			examineNature: null,
			//执行单位
			execuDept: null,
			//项目阶段 1:可行性研究,2:项目立项,3:初步设计,4:详细设计,5:施工建设,6:试生产
			phase: null,
			//任务计划结束时间
			planEndDate: null,
			//任务计划开始时间
			planStartDate: null,
			//项目实际结束时间
			realEndDate: null,
			//项目实际开始时间
			realStartDate: null,
			//任务性质 1:公司内部,2:委托外包
			taskNature: null,
			//项目三同时
			projThrSimultaneous: { id: '', name: '' },
			//任务执行明细
			projThrSimultaneousTaskDetails: [],
		}
	};
	//Vue数据
	var dataModel = {
		type: 1,
		mainModel: {
			vo: newVO(),
			opType: 'view',
			isReadOnly: true,
			title: "",

			//验证规则
			rules: {
				"code": [LIB.formRuleMgr.length(100)],
				"name": [LIB.formRuleMgr.length(100), LIB.formRuleMgr.require("请输入名称")],
				"disable": LIB.formRuleMgr.require("状态"),
				"compId": [LIB.formRuleMgr.require("")],
				"orgId": [LIB.formRuleMgr.length(10)],
				"buildDept": [LIB.formRuleMgr.length(200)],
				"description": [LIB.formRuleMgr.length(500)],
				"designDept": [LIB.formRuleMgr.length(200)],
				"endDate": [LIB.formRuleMgr.allowStrEmpty],
				"headDept": [LIB.formRuleMgr.length(200)],
				"manageDept": [LIB.formRuleMgr.length(200)],
				"nature": [LIB.formRuleMgr.allowIntEmpty, LIB.formRuleMgr.require("请输入项目性质")].concat(LIB.formRuleMgr.allowIntEmpty),
				"owner": [LIB.formRuleMgr.length(200)],
				"phase": [LIB.formRuleMgr.allowIntEmpty, LIB.formRuleMgr.require("请选择项目阶段")].concat(LIB.formRuleMgr.allowIntEmpty),
				"planEndDate": [LIB.formRuleMgr.allowStrEmpty],
				"planStartDate": [LIB.formRuleMgr.allowStrEmpty],
				"realEndDate": [LIB.formRuleMgr.allowStrEmpty],
				"realStartDate": [LIB.formRuleMgr.allowStrEmpty],
				"remark": [LIB.formRuleMgr.length(500)],
				"startDate": [LIB.formRuleMgr.allowStrEmpty],
				"superviseDept": [LIB.formRuleMgr.length(200)],
			}
		},
		taskModel: [{
			vo: taskVo(),
			opType: 'view',
			isReadOnly: true,
			values: [],
			showContent:true,
			beforeEditVo:{}

		}, {
			vo: taskVo(),
			opType: 'view',
			isReadOnly: true,
			values: [],
			showContent:true,
			beforeEditVo:{}
		},
		{
			vo: taskVo(),
			opType: 'view',
			isReadOnly: true,
			values: [],
			showContent:true,
			beforeEditVo:{}
		},
		{
			vo: taskVo(),
			opType: 'view',
			isReadOnly: true,
			values: [],
			showContent:true,
			beforeEditVo:{}
		},
		{
			vo: taskVo(),
			opType: 'view',
			isReadOnly: true,
			values: [],
			showContent:true,
			beforeEditVo:{}
		},
		{
			vo: taskVo(),
			opType: 'view',
			isReadOnly: true,
			values: [],
			showContent:true,
			beforeEditVo:{}
		},
		],
		taskModelRules: {
			"code": [LIB.formRuleMgr.length(100)],
			"type": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("类型")),
			"disable": LIB.formRuleMgr.require("状态"),
			"compId": [LIB.formRuleMgr.require("")],
			"orgId": [LIB.formRuleMgr.length(10)],
			"examineNature": [LIB.formRuleMgr.require("审查性质")].concat(LIB.formRuleMgr.allowIntEmpty),
			"execuDept": [LIB.formRuleMgr.require("执行单位"), LIB.formRuleMgr.length(200)],
			"phase": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
			"planEndDate": [LIB.formRuleMgr.require("任务计划结束时间")],
			"planStartDate": [LIB.formRuleMgr.require("任务计划开始时间")],
			"realEndDate": [LIB.formRuleMgr.require("项目实际结束时间")],
			"realStartDate": [LIB.formRuleMgr.require("项目实际开始时间")],
			"taskNature": [LIB.formRuleMgr.require("任务性质")].concat(LIB.formRuleMgr.allowIntEmpty),
			"projThrSimultaneous.id": [LIB.formRuleMgr.allowStrEmpty],
		},
		tableModel: {
			projThrSimultaneousTaskTableModel: LIB.Opts.extendDetailTableOpt({
				url: "projthrsimultaneous/projthrsimultaneoustasks/list/{curPage}/{pageSize}",
				columns: [
					LIB.tableMgr.ksColumn.code,
					{
						title: "名称",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					}, {
						title: "",
						fieldType: "tool",
						toolType: "edit,del"
					}]
			}),
			projThrSimultaneousTaskDetailTableModel: {
				// url: "projthrsimultaneoustask/projthrsimultaneoustaskdetails/list/{curPage}/{pageSize}",
				columns: [
					{
						//操作时间
						title: "时间",
						fieldName: "operateDate",
						render: function (data) {
							return data.operateDate ? data.operateDate.substr(0, 10) : '';
						},
						width: 120
					},
					{
						//操作 1:内部评审,2:外部评审,3:申请审查
						title: "操作",
						fieldName: "operate",
						render: function (data) {
							return LIB.getDataDic("icm_project_three_simult_task_detail_operate", data.operate);
						},
						width: 150
					},
					{
						//地点
						title: "地点",
						fieldName: "place",
						width: 150
					},
					{
						//参与人员
						title: "参与人员",
						fieldName: "person",
						width: 150
					},

					{
						//事件描述
						title: "事件描述",
						fieldName: "description",
					},
					{
						//事件描述
						title: "附件",
						fieldName: "cloudFiles",
						render: function (row) {
							if (!row.cloudFiles || !row.cloudFiles.length) return ''
							return _.map(row.cloudFiles, function (fileItem) {
								return "<div><a class=\"file-items\"  onClick=\"window.open('\/file\/down\/"+ fileItem.id + "','_blank')\">" + fileItem.orginalName + "</a></div>"
							}).join('')
						},
						tipRender: function (row) {
							if (!row.cloudFiles || !row.cloudFiles.length) return ''
							return _.map(row.cloudFiles, function (fileItem) {
								return fileItem.orginalName
							}).join('&nbsp;')
						},
						renderClass: 'coloud-file-list' ,
						width: 150
					},
					{
						title: "",
						fieldType: "tool",
						toolType: "edit,del",
					}
				]
			},
		},
		formModel: {
			projThrSimultaneousTaskFormModel: {
				show: false,
				hiddenFields: ["projectId"],
				queryUrl: "projthrsimultaneous/{id}/projthrsimultaneoustask/{projThrSimultaneousTaskId}"
			},
			projThrSimultaneousTaskDetailFormModel: {
				show: false,
				hiddenFields: ["taskId"],
				queryUrl: "projthrsimultaneoustask/{id}/projthrsimultaneoustaskdetail/{projThrSimultaneousTaskDetailId}"
			},
		},
		cardModel: {
			projThrSimultaneousTaskCardModel: {
				showContent: true
			},
			projThrSimultaneousTaskDetailCardModel: {
				showContent: true
			},
		},
		selectType: '全部',
		selectLrType: 1,
		selectModel: {
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
		mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
		template: tpl,
		components: {
			"projthrsimultaneoustaskFormModal": projThrSimultaneousTaskFormModal,
			"projthrsimultaneoustaskdetailFormModal": projThrSimultaneousTaskDetailFormModal,


		},
		data: function () {
			return dataModel;
		},
		methods: {
			selectTaskType: function () {
				this.type == 1 ? this.type = 0 : this.type = 1
				if (this.type == 1) {
					this.selectLrType = 1
					this.selectType = '全部'
					var arr = []
					for (var index = 0; index < this.taskModel.length; index++) {
						var vo = taskVo()
						vo.type = index + 1
						vo.phase = 1
						arr.push({
							vo: vo,
							opType: 'view',
							isReadOnly: true,
							showContent:true,
							values: []
						})
					}
					this.$set('taskModel', arr)
					this.queryData(1)
				} else {
					this.selectLrType = '全部'
					this.selectType = 1
					var arr = []
					for (var index = 0; index < this.taskModel.length; index++) {
						var vo = taskVo()
						vo.type = 1
						vo.phase = index + 1
						arr.push({
							vo: vo,
							opType: 'view',
							isReadOnly: true,
							showContent:true,
							values: []
						})
					}
					this.$set('taskModel', arr)
					this.queryData(null, 1)
				}
			},
			doChangeStatus: function (id) {
				this.selectLrType = id
				// _.each(this.taskModel, function (item) {
				// 	item.vo.phase = id
				// })
				if (this.type == 1) {
					var _this = this
					var arr = []
					for (var index = 0; index < _this.taskModel.length; index++) {
						var vo = taskVo()
						vo.type = index + 1
						vo.phase = id
						arr.push({
							vo: vo,
							opType: 'view',
							isReadOnly: true,
							showContent:true,
							values: []
						})
					}
					this.$set('taskModel', arr)

					this.queryData(id)
				}
			},
			doChangeTabStatus: function (id) {
				this.selectType = id
				// _.each(this.taskModel, function (item) {
				// 	item.vo.type = id
				// })
				if (this.type == 0) {
					var _this = this

					var arr = []
					for (var index = 0; index < _this.taskModel.length; index++) {
						var vo = taskVo()
						vo.type = id
						vo.phase = index + 1
						arr.push({
							vo: vo,
							opType: 'view',
							isReadOnly: true,
							showContent:true,
							values: []
						})
					}
					this.$set('taskModel', arr)
					this.queryData(null, id)
				}
			},
			newVO: newVO,
			doShowProjThrSimultaneousTaskFormModal4Update: function (param) {
				this.formModel.projThrSimultaneousTaskFormModel.show = true;
				// this.$refs.projthrsimultaneoustaskFormModal.init("update", {id: this.mainModel.vo.id, projThrSimultaneousTaskId: param.entry.data.id});
			},
			doShowProjThrSimultaneousTaskFormModal4Create: function (param) {
				this.formModel.projThrSimultaneousTaskFormModel.show = true;
				// this.$refs.projthrsimultaneoustaskFormModal.init("create");
			},
			doSaveProjThrSimultaneousTask: function (data) {
				if (data) {
					var _this = this;
					api.saveProjThrSimultaneousTask({ id: this.mainModel.vo.id }, data).then(function () {
						// _this.refreshTableData(_this.$refs.projthrsimultaneoustaskTable);
					});
				}
			},
			doUpdateProjThrSimultaneousTask: function (data) {
				if (data) {
					var _this = this;
					api.updateProjThrSimultaneousTask({ id: this.mainModel.vo.id }, data).then(function () {
						// _this.refreshTableData(_this.$refs.projthrsimultaneoustaskTable);
					});
				}
			},
			doRemoveProjThrSimultaneousTask: function (item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeProjThrSimultaneousTasks({ id: _this.mainModel.vo.id }, [{ id: data.id }]).then(function () {
							_this.$refs.projthrsimultaneoustaskTable.doRefresh();
						});
					}
				});
			},
			doShowProjThrSimultaneousTaskDetailFormModal4Update: function (param) {
				var id = param.entry.data.projThrSimultaneousTask.id
				var _this = this
				_.each(this.taskModel, function (item, index) {
					if (item.vo.id == id) {
						_this.index = index
						return false
					}
				})
				this.formModel.projThrSimultaneousTaskDetailFormModel.show = true;
				this.$refs.projthrsimultaneoustaskdetailFormModal.init("update", { id: id, projThrSimultaneousTaskDetailId: param.entry.data.id });
			},
			doShowProjThrSimultaneousTaskDetailFormModal4Create: function (index) {
				this.index = index//确定是哪一个taskModel
				this.formModel.projThrSimultaneousTaskDetailFormModel.show = true;
				this.$refs.projthrsimultaneoustaskdetailFormModal.init("create");
			},
			doSaveProjThrSimultaneousTaskDetail: function (data) {
				if (data) {
					data.projectId = this.mainModel.vo.id;
					var _this = this;
					api.saveProjThrSimultaneousTaskDetail({ id: this.taskModel[this.index].vo.id }, data).then(function () {
						_this.refreshDetailTableData(_this.index);
					});
				}
			},
			refreshDetailTableData: function (index) {
				var _this = this;
				api.queryProjThrSimultaneousTaskDetails({ pageNo: 1, pageSize: 999, id: _this.taskModel[index].vo.id }).then(function (res) {
					_this.taskModel[index].values = res.data.list
				})
				// _.each(arguments, function () {
				// 	ref.doQuery({ id: _this.taskModel[this.index].vo.id });
				// })
			},
			doUpdateProjThrSimultaneousTaskDetail: function (data) {
				if (data) {
					var _this = this;
					api.updateProjThrSimultaneousTaskDetail({ id: this.taskModel[this.index].vo.id }, data).then(function () {
						_this.refreshDetailTableData(_this.index);
					});
				}
			},
			doRemoveProjThrSimultaneousTaskDetail: function (param) {
				var _this = this;
				var data = param.entry.data;
				var id = param.entry.data.projThrSimultaneousTask.id
				var _this = this
				_.each(this.taskModel, function (item, index) {
					if (item.vo.id == id) {
						_this.index = index
						return false
					}
				})
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeProjThrSimultaneousTaskDetails({ id: id }, [{ id: data.id }]).then(function () {
							_this.refreshDetailTableData(_this.index);
						});
					}
				});
			},
			afterInit:function(){
				if(this.mainModel.opType=='create'){
					
					this.mainModel.vo.compId = LIB.user.compId;
					this.mainModel.vo.orgId = LIB.user.compId;
				}
				var arr = []
					for (var index = 0; index < this.taskModel.length; index++) {
						var vo = taskVo()
						vo.type = index + 1
						vo.phase = 1
						arr.push({
							vo: vo,
							opType: 'view',
							isReadOnly: true,
							showContent:true,
							values: []
						})
					}
					this.$set('taskModel', arr)
			},
			afterInitData: function () {
				
					
				var _this = this;
				this.selectType = '全部',
					this.selectLrType = 1,
					_.each(_this.taskModel, function (task, index) {
						task.opType='view'
						task.isReadOnly= true
						task.showContent=true,
						task.values= []
						task.beforeEditVo={}
						task.vo.type = index + 1
						task.vo.phase = 1
					})
				//this.$refs.projthrsimultaneoustaskdetailTable.doQuery({id : this.mainModel.vo.id});
				this.queryData(1)

			},
			queryData: function(phase, type) {
				var _this = this;
				if (phase) {
					api.queryProjThrSimultaneousTasks({ pageNo: 1, pageSize: 999, id: this.mainModel.vo.id }).then(function (res) {
						res.data.list = _.filter(res.data.list, function (list) {
							return list.phase == phase
						})
						_.each(res.data.list, function (list) {
							_.each(_this.taskModel, function (task, index) {
								if (list.type == task.vo.type) {
									_.extend(_this.taskModel[index].vo, list)
									api.queryProjThrSimultaneousTaskDetails({ pageNo: 1, pageSize: 999, id: _this.taskModel[index].vo.id }).then(function (res) {
										_this.taskModel[index].values = res.data.list
									})
								}

							})

						})

					})
				} else if (type) {
					api.queryProjThrSimultaneousTasks({ pageNo: 1, pageSize: 999, id: this.mainModel.vo.id }).then(function (res) {
						res.data.list = _.filter(res.data.list, function (list) {
							return list.type == type
						})
						_.each(res.data.list, function (list) {
							_.each(_this.taskModel, function (task, index) {
								if (list.phase == task.vo.phase) {
									_.extend(_this.taskModel[index].vo, list)
									api.queryProjThrSimultaneousTaskDetails({ pageNo: 1, pageSize: 999, id: _this.taskModel[index].vo.id }).then(function (res) {
										_this.taskModel[index].values = res.data.list
									})
								}

							})

						})

					})
				}

			},
			beforeInit: function () {
				//this.$refs.projthrsimultaneoustaskdetailTable.doClearData();
				
			},
			doEditTask: function (index) {
				this.taskModel[index].opType = "update";
				this.taskModel[index].isReadOnly = false;

				this.taskModel[index].isReadOnly = false;
				//存储修改编辑前的变量, 如果点击取消后还原
				this.taskModel[index].beforeEditVo = {};
				this.taskModel[index].beforeEditVo = _.cloneDeep(this.taskModel[index].vo);

			},
			doCancelTask: function(index) {
				var _this =this
				_this.taskModel[index].vo = _.cloneDeep(_this.taskModel[index].beforeEditVo);
				_this.taskModel[index].opType = "view";
				_this.taskModel[index].isReadOnly = true;
			},
			doSaveTask: function (id, index) {

				var _this = this;
				var _data = this.taskModel[index];
				var ref = null
				var value = null
				if (this.type == 1) {
					value = 'ruleformtask' + id
				} else {
					value = "ruleformtasktype" + id
				}

				_.each(this.$children, function (item) {
					if (item.$options.name == "simple-card") {
						_.each(item.$children, function (key) {

							if (key.$el.getAttribute("id") == value) {
								ref = key
							}
						})
					}

				})

				ref.validate(function (valid) {
					if (valid) {
						var _vo = _data.vo;
						if(_vo.planEndDate<_vo.planStartDate){
							LIB.Msg.error("计划结束时间必须大于计划开始时间");
							return
						}
						if(_vo.realEndDate<_vo.realStartDate){
							LIB.Msg.error("实际结束时间必须大于实际开始时间");
							return
						}
						if (_data.vo.id == null || _this.mainModel.opType === 'create') {
							api.saveProjThrSimultaneousTask({ id: _this.mainModel.vo.id }, _vo).then(function (res) {
								LIB.Msg.info("保存成功");
								_data.vo.id = res.data.id;
								_this.taskModel[index].opType = "view";
								_this.taskModel[index].isReadOnly = true;

							});
						} else {
							//_vo = _this._checkEmptyValue(_vo);
							api.updateProjThrSimultaneousTask({ id: _this.mainModel.vo.id }, _vo).then(function () {
								LIB.Msg.info("保存成功");
								_this.taskModel[index].opType = "view";
								_this.taskModel[index].isReadOnly = true;
							});
						}
					} else {
						//console.error('doSave error submit!!');
					}
				});
			},

		},
		events: {
		},
		init: function () {
			this.$api = api;
		},
		// ready: function(){
		// 	this.$set('taskModel.isReadOnly',[true, true, true, true])	
		// 	this.$set('taskModel.isReadOnlytype',[true, true, true, true, true, true])
		// }
	});

	return detail;
});