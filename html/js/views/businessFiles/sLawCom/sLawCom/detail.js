define(function (require) {
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var companySelectModel = require("componentsEx/selectTableModal/companySelectModel");
	var selectLaws = require("./dialog/selectLaws")
	var deptSelectModal = require("componentsEx/selectTableModal/deptSelectModal");
	//初始化数据模型
	var newVO = function () {
		return {
			id: null,
			//编码
			code: null,
			//禁用标识 0启用，1禁用
			disable: "0",
			//公司id
			compId: null,
			//部门id
			orgId: null,
			//适用文件
			applicableDocuments: null,
			//适用条款
			applicableProvisions: null,
			//实施情况
			implementation: null,
			//使用的条款
			usedProvisions: null,
			evaluation: '1',
			//法律法规
			irlLegalRegulation: { id: '', name: '', identifier: '' },
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
				"disable": LIB.formRuleMgr.require("状态"),
				"compId": [LIB.formRuleMgr.require("公司")],
				"orgId": [LIB.formRuleMgr.length(10),LIB.formRuleMgr.require("部门")],
				"applicableDocuments": [LIB.formRuleMgr.length(255)],
				"applicableProvisions": [LIB.formRuleMgr.length(255)],
				"implementation": [LIB.formRuleMgr.length(65535)],
				"usedProvisions": [LIB.formRuleMgr.length(255)],
				'irlLegalRegulation.identifier':[LIB.formRuleMgr.require("编号")],
				evaluation:[LIB.formRuleMgr.require("符合性")],
				"irlLegalRegulation.id": [LIB.formRuleMgr.require("法律法规")],
			}
		},

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
		lawsSelectModel: {
			visible: false,
		},
		fileModel: {
			file: {
				cfg: {
					params: {
						recordId: null,
						dataType: 'IRL1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'LIR'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					},
					filters: {
						max_file_size: '10mb',
					},
				},
				data: []
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
			'selectLaws': selectLaws,
			'companySelectModel': companySelectModel,
			'deptSelectModal': deptSelectModal,
		},
		data: function () {
			return dataModel;
		},
		methods: {
			newVO: newVO,

			doSelectDept: function () {

				this.deptSelectModel.visible = true

			},
			afterInit:function(){
                if (this.mainModel.opType=='create') {
                   
                    if (LIB.user.compId) {
                        this.mainModel.vo.compId=LIB.user.compId
                    }
                }
               
            },
			afterInitData:function(){
				var _this = this;
				_this.$api.listFile({ recordId: this.mainModel.vo.irlLegalRegulation.id }).then(function (res) {

					var fileTypeMap = {};
					_.each(_this.fileModel, function (item) {
						_.propertyOf(item)("cfg.params.dataType") && (fileTypeMap[item.cfg.params.dataType] = item);
					});

					_.each(res.data, function (file) {
						var fm = fileTypeMap[file.dataType];
						if (fm) {
							fm.data.push(LIB.convertFileData(file));
						}
					});

				});
			},
			doSelectCompany: function () {

				this.companySelectModel.show = true

			},
			doSaveCompany: function (val) {
				var _this = this;
				_this.mainModel.vo.compId = val[0].id

			},
			doSelectLaws: function () {
				this.lawsSelectModel.visible = true
			},
			doSaveLaw: function (selectedDatas) {
				var _this = this
				_.extend(this.mainModel.vo.irlLegalRegulation, selectedDatas)
				this.fileModel.file.cfg.params.recordId = this.mainModel.vo.irlLegalRegulation.id
				
				this.fileModel.file.cfg.data=[]
				_this.$api.listFile({ recordId: this.mainModel.vo.irlLegalRegulation.id }).then(function (res) {

					var fileTypeMap = {};
					_.each(_this.fileModel, function (item) {
						_.propertyOf(item)("cfg.params.dataType") && (fileTypeMap[item.cfg.params.dataType] = item);
					});
					fileTypeMap['IRL1'].data=[]
					_.each(res.data, function (file) {
						var fm = fileTypeMap[file.dataType];
						
						if (fm) {
							fm.data.push(LIB.convertFileData(file));
						}
					});

				});
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