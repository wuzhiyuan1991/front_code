define(function (require) {
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var companySelectModel = require("componentsEx/selectTableModal/companySelectModel");

	var deptSelectModal = require("componentsEx/selectTableModal/deptSelectModal");
	//初始化数据模型
	var newVO = function () {
		return {
			id: null,
			//编号
			code: null,
			//用品名称
			name: null,
			//禁用标识 0:未禁用,1:已禁用
			disable: "0",
			//所属公司
			compId: null,
			//所属部门
			orgId: null,
			//用品型号
			model: null,
			//计量单位
			unit: null,
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
				// "code" : [LIB.formRuleMgr.require("编号"),
				// 	  LIB.formRuleMgr.length(200)
				// ],
				// "name" : [LIB.formRuleMgr.length(100)],
				// "disable" :LIB.formRuleMgr.require("状态"),
				// "compId" : [LIB.formRuleMgr.require("所属公司")],
				// "orgId" : [LIB.formRuleMgr.length(10)],
				// "model" : [LIB.formRuleMgr.length(100)],
				// "unit" : [LIB.formRuleMgr.require("计量单位"),
				//     LIB.formRuleMgr.length(100)
				// ],
			}
		},
		tableModel: {

			attendeesTableModel: LIB.Opts.extendDetailTableOpt({
				// url : "testequipment/testusers/list/{curPage}/{pageSize}",
				columns: [
					{
						title: "名称",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					}, {
						title: "部门",
						fieldName: "dept",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					}, {
						title: "",
						fieldType: "tool",
						toolType: "move,del"
					}]
			}),

			ccUserTableModel: LIB.Opts.extendDetailTableOpt({
				// url : "testequipment/testusers/list/{curPage}/{pageSize}",
				columns: [
					{
						title: "名称",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					}, {
						title: "部门",
						fieldName: "dept",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					}, {
						title: "",
						fieldType: "tool",
						toolType: "move,del"
					}]
			})
		},
		// fileModel:{
		//     file : {
		//         cfg: {
		//             params: {
		//                 recordId: null,
		//                 dataType: 'LTOHPY1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
		//                 fileType: 'LTOHPY'    // 文件类型标识，需要根据数据库的注释进行对应的修改
		//             },
		//             filters: {
		//                 max_file_size: '10mb',
		//             },
		//         },
		//         data : []
		//     }
		// },

		companySelectModel: {
			filterData: null,
			list: [],
			num: 0,
			show: false
		},

		deptSelectModel: {
			visible: false,
			filterData: {
				compId: null,
				type: 2
			}
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
			'companySelectModel': companySelectModel,
			'deptSelectModal': deptSelectModal,
		},
		data: function () {
			return dataModel;
		},
		watch: {
			'mainModel.vo.compId': function (val) {
				if (val) {
					this.deptSelectModel.filterData.compId = val
				}
			}
		},
		methods: {
			newVO: newVO,
			initData: function (param, transferVO) {
				// // 初始化详情数据 - 测试数据 start
				_.extend(this.mainModel.vo, transferVO)
				if (this.$refs.attendeesTable) {
					this.$refs.attendeesTable.values = [
						{
							name: '王云',
							dept: '安全管理部'
						},
						{
							name: '谢山',
							dept: '综合计划部'
						}
					];
				}
				// 初始化详情数据 - 测试数据 end
			},
			doSelectDept: function () {

				this.deptSelectModel.visible = true

			},
			doSelectCompany: function () {

				this.companySelectModel.show = true

			},
			doSaveCompany: function (val) {
				var _this = this;
				_this.mainModel.vo.compId = val[0].id

			},
			doSaveDepts: function (selectedDatas) {
				var _this = this

				_this.mainModel.vo.orgId = selectedDatas[0].id

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