define(function (require) {
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var selectGroup = require('./dialog/selectGroup')
	//初始化数据模型
	var newVO = function () {
		return {
			id: null,
			//编码
			code: null,
			//名称
			name: null,
			//禁用标识 0未禁用，1已禁用
			disable: "0",
			//所属公司
			compId: null,
			//所属部门
			orgId: null,
			//核定存量
			checkStock: null,
			//用量
			dosage: 0,
			//存放部位
			location: null,
			//月份
			month: null,
			//主要用途
			purpose: null,
			//剩余贮量
			residue: 0,
			//专管人员的姓名
			userName: null,
			userId: null,
			attr1: 0,
			attr2: null,
			attr3: 0,
			attr4: 0
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
				"code": [LIB.formRuleMgr.require("编码"),
				LIB.formRuleMgr.length(100)
				],
				"name": [LIB.formRuleMgr.length(100), LIB.formRuleMgr.require('名字')],
				"disable": LIB.formRuleMgr.require("状态"),
				"compId": [LIB.formRuleMgr.require("所属公司")],
				"orgId": [LIB.formRuleMgr.length(10), LIB.formRuleMgr.require("部门")],
				"checkStock": [LIB.formRuleMgr.length(100)],
				"dosage": [LIB.formRuleMgr.length(100), LIB.formRuleMgr.require('用量')],
				"location": [LIB.formRuleMgr.length(100), LIB.formRuleMgr.require("存放位置")],
				"month": [LIB.formRuleMgr.require("月份")],
				"purpose": [LIB.formRuleMgr.length(100)],
				"residue": [LIB.formRuleMgr.length(100), LIB.formRuleMgr.require('剩余贮量')],
				"userName": [LIB.formRuleMgr.length(100)],
				"userId": [LIB.formRuleMgr.require("专管人员")],
			}
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
		selectGroup: {
			show: false
		},
		chemical: {},
		user: {}
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
			'userSelectModal': userSelectModal,
			'selectGroup': selectGroup
		},
		data: function () {
			return dataModel;
		},

		methods: {
			newVO: newVO,
			doSaveUsers: function (selectedDatas) {
				var _this = this
				_this.user = selectedDatas[0]
				_this.mainModel.vo.userId = selectedDatas[0].id
				_this.mainModel.vo.userName = selectedDatas[0].name
			},
			afterInit: function () {
				if (this.mainModel.opType == 'create') {
					this.user = { id: null, name: null }
					this.chemical = { name: null }
					this.mainModel.vo.dosage = '0'
					this.mainModel.vo.residue = '0'
				}

			},

			doSelectGroup: function () {
				this.selectGroup.show = true
			},
			afterInitData: function () {
				this.user = { id: this.mainModel.vo.userId, name: this.mainModel.vo.userName }
				this.chemical = { name: this.mainModel.vo.name }
			},
			afterDoSave: function () {

				if (this.mainModel.opType == 'create') {
					this.init('view', this.mainModel.vo.id)
				}

			},
			changeQryYear: function (val) {
				var date = new Date(val)
				var month = parseInt(date.getMonth()) + 1
				if (month<10) {
					var year = date.getFullYear() + '-0' + month + ''
				this.mainModel.vo.month = year
				}else{
					var year = date.getFullYear() + '-' + month + ''
				this.mainModel.vo.month = year
				}
				
			},
			doSaveName: function (selectedDatas) {
				var _this = this
				_this.chemical = selectedDatas[0]
				_this.mainModel.vo.name = selectedDatas[0].name
				_this.mainModel.vo.attr1 = selectedDatas[0].monad
				_this.mainModel.vo.attr2 = selectedDatas[0].storage
				_this.mainModel.vo.attr3 = selectedDatas[0].explosive
				_this.mainModel.vo.attr4 = selectedDatas[0].precursor
			},
			doSelectUser: function () {

				this.selectModel.userSelectModel.visible = true
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