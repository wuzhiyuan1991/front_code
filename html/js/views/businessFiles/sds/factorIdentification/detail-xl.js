define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编码
			code : null,
			//巡检结果名称
			name : null,
			//禁用标识 0:未禁用,1:已禁用
			disable : null,
			address: null,
			phone: null,
            fax: null,
            emergencyPhone: null,
            type: '0',
            supplier: null,
            usage: null,
            transportationType: '0',
            unNumber: null,
            transportationName: null,
            dangerType: null,
            packageName: null
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
				"code" : [LIB.formRuleMgr.length()],
				"name" : [LIB.formRuleMgr.require("名称"),
						  LIB.formRuleMgr.length()
				],
                supplier: [LIB.formRuleMgr.require("供应商")],
                type: [LIB.formRuleMgr.require("产品类型")],
                transportationType: [LIB.formRuleMgr.require("运输类型")]
	        }
		},

        tableModel: {
			elementModel: {
				columns: [
					{
						title: "名称"
					},
					{
						title: "CAS"
					},
					{
						title: "含量"
					},
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "del"
                    }
				]
			}
		},
        types: [
			{
				id: '0',
				value: '记录'
			}
		],
        transportationTypes: [
            {
                id: '0',
                value: '现在'
            }
        ],
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
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,

		},
		events : {
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});