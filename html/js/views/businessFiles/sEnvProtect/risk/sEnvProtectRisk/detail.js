define(function (require) {
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var companySelectModel = require("componentsEx/selectTableModal/companySelectModel");

	var deptSelectModal = require("componentsEx/selectTableModal/deptSelectModal");
	//初始化数据模型
	var date = new Date()
	var year = date.getFullYear() + ''
	var newVO = function () {
		return {
			id: null,
			//编码
			code: null,
			office: null,
			//作业名称
			name: null,
			//评价,一般：1-12分;重大：12分以上
			score: null,
			//持续时间,3：24小时，2：8至24小时，1：8小时以下
			sustain: null,
			//发生频率，3.连续，2.每天，3.每周以上一次
			frequency: null,
			//影响规模，3.区域外,2.本地区,1排放点
			scop: null,
			//污染物成分
			composition: null,
			//环境因素15
			envEl15: 0,
			//环境因素14
			envEl14: 0,
			//环境因素13
			envEl13: 0,
			//环境因素3
			envEl3: 0,
			//环境因素12
			envEl12: 0,
			//环境因素11
			envEl11: 0,
			//环境因素10
			envEl10: 0,
			//环境因素9
			envEl9: 0,
			//环境因素8
			envEl8: 0,
			//环境因素7
			envEl7: 0,
			//环境因素6
			envEl6: 0,
			//环境因素5
			envEl5: 0,
			//环境因素4
			envEl4: 0,
			//环境因素2
			envEl2: 0,
			//环境因素1
			envEl1: 0,
			//环境因素
			envFactor: null,
			//禁用标识 0未禁用，1已禁用
			disable: "0",
			//公司id
			compId: null,
			//部门id
			orgId: null,
			//目前控制措施
			measures: null,
			year: year
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
				"name": [LIB.formRuleMgr.require("作业名称"),
				LIB.formRuleMgr.length(500)
				],
				office: [LIB.formRuleMgr.require("单位"),
				LIB.formRuleMgr.length(50)
				],
				"score": LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.require("评价,一般：1-12分;重大：12分以上")),
				"sustain": LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.require("持续时间,3：24小时，2：8至24小时，1：8小时以下")),
				"frequency": LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.require("发生频率，3.连续，2.每天，3.每周以上一次")),
				"scop": LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.require("影响规模，3.区域外,2.本地区,1排放点")),
				"composition": [LIB.formRuleMgr.require("污染物主要成分"),
				LIB.formRuleMgr.length(255)
				],

				"envFactor": [LIB.formRuleMgr.require("环境因素"),
				LIB.formRuleMgr.length(255)
				],
				"disable": LIB.formRuleMgr.require("状态"),
				"compId": [LIB.formRuleMgr.require("公司")],
				"orgId": [LIB.formRuleMgr.length(10),LIB.formRuleMgr.require("部门")],
				"measures": [LIB.formRuleMgr.require("目前控制措施"),LIB.formRuleMgr.length(65535)],
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
			'companySelectModel': companySelectModel,
			'deptSelectModal': deptSelectModal,
		},
		data: function () {
			return dataModel;
		},
		props:{
			json:{
				type:Array,
				default:[]
			}
		},
		// computed: {
		// 	score: function () {
		// 		var score = parseInt(this.mainModel.vo.sustain) * parseInt(this.mainModel.vo.frequency) * parseInt(this.mainModel.vo.scop)
		// 		if (score > 12) {
		// 			this.mainModel.vo.score = '1'
		// 			return '1'
		// 		} else {
		// 			this.mainModel.vo.score = '0'
		// 			return '0'
		// 		}
		// 	}
		// },
		watch:{
            'mainModel.vo.compId':function(val){
                if (val) {
                        this.deptSelectModel.filterData.compId=val
                }
			},
			'mainModel.vo.sustain':function (val) {
				
				var score = parseInt(val) * parseInt(this.mainModel.vo.frequency) * parseInt(this.mainModel.vo.scop)
				if (score > 12) {
					this.mainModel.vo.score = '1'
				
				} else {
					this.mainModel.vo.score = '0'
					
				}
			},
			'mainModel.vo.frequency':function (val) {
				
				var score = parseInt(this.mainModel.vo.sustain) * parseInt(val) * parseInt(this.mainModel.vo.scop)
				if (score > 12) {
					this.mainModel.vo.score = '1'
				
				} else {
					this.mainModel.vo.score = '0'
					
				}
			},
			'mainModel.vo.scop':function (val) {
				
				var score = parseInt(this.mainModel.vo.sustain) * parseInt(this.mainModel.vo.frequency) * parseInt(val)
				if (score > 12) {
					this.mainModel.vo.score = '1'
				
				} else {
					this.mainModel.vo.score = '0'
					
				}
			},
        },
		methods: {
			newVO: newVO,
			dochange: function (val) {
				
				if (this.mainModel.vo[val] == '0') {
					this.mainModel.vo[val] = '1'
				} else {
					this.mainModel.vo[val] = '0'
				}

			},
			afterInit:function(){
                if (this.mainModel.opType=='create') {
                   
                    if (LIB.user.compId) {
                        this.mainModel.vo.compId=LIB.user.compId
                    }
                }
               
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
		},
		
	});

	return detail;
});