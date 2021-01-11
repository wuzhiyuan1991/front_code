define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var companySelectModel = require("componentsEx/selectTableModal/companySelectModel");
    
    var deptSelectModal = require("componentsEx/selectTableModal/deptSelectModal");
	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//编码
			code : null,
			//填报人
			reporter : null,
			//点位
			position : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//公司id
			compId : null,
			//部门id
			orgId : null,
			//预留字段
			content : null,
			//排放浓度
			emissConcentra : null,
			//排放方式
			emissMode : null,
			//排放速度
			emissSpeed : null,
			//污染物种类
			kind : null,
			//取样时间
			sampleDate : null,
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
				"reporter" : [LIB.formRuleMgr.require("填报人"),
						  LIB.formRuleMgr.length(100)
				],
				"position" : [LIB.formRuleMgr.require("点位"),
						  LIB.formRuleMgr.length(255)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("公司")],
				"orgId" : [LIB.formRuleMgr.length(10),LIB.formRuleMgr.require("部门")],
				"content" : [LIB.formRuleMgr.length(1000)],
				"emissConcentra" : [LIB.formRuleMgr.length(255),LIB.formRuleMgr.require("排放浓度")],
				"emissMode" : [LIB.formRuleMgr.length(255),LIB.formRuleMgr.require("排放方式")],
				"emissSpeed" : [LIB.formRuleMgr.length(255),LIB.formRuleMgr.require("排放速度")],
				"kind" : [LIB.formRuleMgr.require("污染物种类"),LIB.formRuleMgr.length(255)],
				"sampleDate" :  [LIB.formRuleMgr.require("取样时间")],
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
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {
			'companySelectModel': companySelectModel,
            'deptSelectModal': deptSelectModal,
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
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
                _this.mainModel.vo.compId=val[0].id

			},
			doSaveDepts: function (selectedDatas) {
                var _this = this
                
                _this.mainModel.vo.orgId = selectedDatas[0].id

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