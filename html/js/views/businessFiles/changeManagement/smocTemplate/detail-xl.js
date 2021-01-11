define(function (require) {
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var addGroup = require("./dialog/addGroup")
	//初始化数据模型
	var newVO = function () {
		return {
			id: null,
			//编码
			code: null,
			//分组名称
			name: null,
			//模板内容
			content: null,
			//禁用标识 0:未禁用,1:已禁用
			disable: "0",
			//公司id
			compId: null,
			//部门id
			orgId: null,
			//分组类型 0:未设计类型,1:安全相关,2:职业健康相关,3:环境相关,4:设备相关,5:其他
			type: null,
		}
	};
	//Vue数据
	var dataModel = {
		mainModel: {
			vo: newVO(),
			opType: 'view',
			isReadOnly: true,
			title: "",

			//验证规则
			rules: {
				"code": [LIB.formRuleMgr.length(100)],
				"name": [LIB.formRuleMgr.length(100), LIB.formRuleMgr.require("模板名称")],
				"content": [LIB.formRuleMgr.require("模板内容"),
				LIB.formRuleMgr.length(10000)
				],
				"disable": LIB.formRuleMgr.require("状态"),
				"compId": LIB.formRuleMgr.require("公司"),
				"orgId": [LIB.formRuleMgr.length(10)],
				"type": [LIB.formRuleMgr.require("模板类型")].concat(LIB.formRuleMgr.allowIntEmpty),
			}
		},
		checkBasisTableModel: LIB.Opts.extendDetailTableOpt({

			columns: [
				{
					title: "风险项",
					fieldName: "name",
					width: 400
				},
				{
					title: "辨识结果",
					fieldName: "result",
					fieldType: "custom",
					renderClass: 'text-center',
					showTip: false,
					render: function (data) {
						if (data.result == 1) {
							return '<label  class="ivu-checkbox-wrapper result1"><span class="ivu-checkbox ivu-checkbox-checked result1" ><span class="ivu-checkbox-inner result1"></span></span><span></span>是</label><label class="ivu-checkbox-wrapper result2"><span class="ivu-checkbox result2"><span class="ivu-checkbox-inner result2"></span></span><span></span>否</label>'
						} else if (data.result == 0) {
							return '<label class="ivu-checkbox-wrapper result1"><span class="ivu-checkbox result1"><span class="ivu-checkbox-inner result1"></span></span><span></span>是</label><label class="ivu-checkbox-wrapper result2"><span class="ivu-checkbox result2"><span class="ivu-checkbox-inner result2"></span></span><span></span>否</label>';
						} else if (data.result == 2) {
							return '<label class="ivu-checkbox-wrapper result1"><span class="ivu-checkbox result1"><span class="ivu-checkbox-inner result1"></span></span><span></span>是</label><label class="ivu-checkbox-wrapper result2"><span class="ivu-checkbox ivu-checkbox-checked result2" ><span class="ivu-checkbox-inner result2" style="background:red;border-color:red"></span></span><span></span>否</label>'
						}
					},
					width: 120
				},

				{
					title: "",
					fieldType: "tool",
					toolType: "edit,del,move"
				}]
		}),
		addGroup: {
			visible: false,
		},
		riskItems: [],
		add: {
			visible: false,
			name: null,
			id: null,
			opType: 'create',
			rules: {
				"name": LIB.formRuleMgr.require("分组名"),
			}
		},
		groupIndex: null,
		itemIndex: null,
		

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
			'addGroup': addGroup
		},
		watch: {
			'mainModel.isReadOnly': function (val) {
				var _this = this
				if (val) {
					this.checkBasisTableModel.columns[2].visible = false
				} else {
					this.checkBasisTableModel.columns[2].visible = true
				}
				if (_this.$refs.groupcrad1) {
					if (_this.$refs.groupcrad1.length > 0) {
						_.each(_this.$refs.groupcrad1, function (item) {
							_.each(item.$children, function (child) {
								child.refreshColumns && child.refreshColumns()
							})

						})
					}

				}




			}
		},
		data: function () {
			return dataModel;
		},
		methods: {
			newVO: newVO,
			doTableCellClick: function (data) {

				if (this.mainModel.isReadOnly) {
					return
				}
				var target = data.event.target
				if (target && target.classList.contains("result1")) {

					data.entry.data.result = 1

				} else if (target && target.classList.contains("result2")) {
					data.entry.data.result = 2

				}
			},
			doShowItemFormModal4Create: function (group, index) {
				this.$broadcast("doCeateGroup", group)
				this.groupIndex = index
			},
			doSaveItem: function (data, title) {
				var _this = this
				if (title == '新增') {
					var obj = { "deleteFlag": "0", "disable": "0", "name": "", "result": "0", "status": "0", "attr5": "0", "orderNo": '' }
					obj.name = data.name
					obj.result = data.result
					obj.orderNo = (this.riskItems[this.groupIndex].riskItems.length + 1) + ''
					this.riskItems[this.groupIndex].riskItems.push(obj)
					LIB.Msg.info('新增成功')

				} else {
					var index = parseInt(data.orderNo) - 1
					this.riskItems[this.groupIndex].riskItems[this.itemIndex].name = data.name
					this.riskItems[this.groupIndex].riskItems[this.itemIndex].result = data.result
					LIB.Msg.success('修改成功')

				}
			},
			doAddGroupName: function () {
				var _this = this
				this.$refs.addform.validate(function (val) {
					if (val) {
						if (_this.add.opType == 'create') {

							_this.riskItems.push({ name: _this.add.name, riskItems: [] })
							_this.add.visible = false
							LIB.Msg.info('新增成功')

						} else {

							_this.riskItems[_this.groupIndex].name = _this.add.name
							_this.add.visible = false
							LIB.Msg.success('修改成功')

						}

					}
				})
			},
			doShowCheckBasisSelectModal: function () {
				this.add.visible = true
				this.add.name = null

				this.add.opType = 'create'
				this.$refs.addform.resetFields()
			},
			doShowGroupFormModal4Update: function (group, index) {
				this.add.visible = true
				this.add.name = group.name

				this.add.opType = 'update'
				this.$refs.addform.resetFields()
				this.groupIndex = index
			},
			doRemoveGroup: function (group, index) {
				var _this = this;

				LIB.Modal.confirm({
					title: '删除当前分组?',
					onOk: function () {
						_this.riskItems.splice(index, 1)
						LIB.Msg.info('删除成功')

					}
				});

			},
			afterDoCancel: function () {
				this.init('view', this.mainModel.vo.id)
			},
			doMove: function (offset, group, index) {
				var _this = this
				var length = offset + index
				if (length != -1 && length < _this.riskItems.length) {

					var temp = _this.riskItems[length]
					_this.riskItems[length] = _this.riskItems[index]
					_this.riskItems[index] = temp
					var data =  _this.riskItems
					_this.riskItems=[]
					this.$nextTick(function(){
						_this.$set('riskItems', data)
					})
					
					LIB.Msg.info('移动成功')

				}
			},
			domoveGroup: function (item) {
				var _this = this;
				var data = item.entry.data;
				this.itemIndex = item.cell.rowId
				var length = item.offset + parseInt(data.orderNo)
				setTimeout(function () {

					if (length != 0 && length <= _this.riskItems[_this.groupIndex].riskItems.length) {

						var temp = _this.riskItems[_this.groupIndex].riskItems[length - 1]
						temp.orderNo = data.orderNo
						_this.riskItems[_this.groupIndex].riskItems[parseInt(temp.orderNo) - 1] = temp
						data.orderNo = length + ''
						_this.riskItems[_this.groupIndex].riskItems[length - 1] = data

					}
					LIB.Msg.info('移动成功')
				}, 300)

			},
			doRemoveCheckBasis: function (item) {
				var _this = this;
				this.itemIndex = item.cell.rowId
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						setTimeout(function () {
							_this.riskItems[_this.groupIndex].riskItems.splice(_this.itemIndex, 1)
							// _this.riskItems.splice(parseInt(data.orderNo)-1,1)
							LIB.Msg.info('删除成功')
							_.each(_this.riskItems[_this.groupIndex].riskItems, function (item, index) {
								item.orderNo = (index + 1) + ''
							})
						}, 300)

					}
				});
			},
			doEidtGroup: function (group) {
				this.itemIndex = group.cell.rowId
				this.$broadcast("doUpdateGroup", group.entry.data)
			},
			beforeDoSave: function () {

				_.each(this.riskItems, function (item, index) { item.orderNo = index + 1 })

				this.mainModel.vo.content = JSON.stringify(this.riskItems)

			},
			beforeDoDelete: function () {

				this.mainModel.vo.content = JSON.stringify(this.riskItems)


			},
			afterInit: function () {
				this.riskItems = []
			},
			afterInitData: function () {
				var _this = this
				this.mainModel.vo.content = JSON.parse(this.mainModel.vo.content)
				this.riskItems = this.mainModel.vo.content
				if (this.mainModel.opType == 'view') {
					this.checkBasisTableModel.columns[2].visible = false
				} else {
					this.checkBasisTableModel.columns[2].visible = true
				}

				if (_this.$refs.groupcrad1) {
					if (_this.$refs.groupcrad1.length > 0) {
						_.each(_this.$refs.groupcrad1, function (item) {
							_.each(item.$children, function (child) {
								child.refreshColumns && child.refreshColumns()
							})

						})
					}

				}
			}
		},
		events: {
		},
		init: function () {
			this.$api = api;
		}
	});

	return detail;
});