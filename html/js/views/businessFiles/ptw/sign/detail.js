define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");

    LIB.registerDataDic("iptw_catalog_is_signer_type", [
        ["1","是"],
        ["3","否"],
    ]);

	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//编码
			code : null,
			//作业签发人
			name : null,
			//启用/禁用 0:启用,1:禁用
			disable : "1",
			//字典类型 1:作业类型,2:作业分级,3:个人防护设备,4:气体检测指标,5:签发人员,6:作业取消声明,7:作业完成声明
			type : 5,
			//承诺内容
			content : null,
			//应用承诺 0:否,1:是
			enableCommitment : '1',
			//作业固有角色 0:否,1:是
			isInherent : '0',
			//是否可复选签发人 0:否,1:是
			isMultiple : '1',
			//签发人类型 1:作业申请人,2:作业批准人,3:自定义会签角色
			signerType : '3',
			compId: null,
			orgId: null
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
				"code" : [LIB.formRuleMgr.length(255)],
				"name" : [LIB.formRuleMgr.require("作业签发人"),
						  LIB.formRuleMgr.length(50)
				],
				"content" : [LIB.formRuleMgr.length(500)],
				"enableCommitment" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"signerType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
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
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {

        },
        props: {
			selectOrgId:{
				type:String,
				default: null
			}
		},

		watch:{
			"mainModel.vo.signerType": function (val) {
				if(val == '1') {
                    this.mainModel.vo.isMultiple = '0';
				}
            }
		},

		data:function() {
			return dataModel;
		},
		methods:{
			newVO : newVO,
            beforeDoSave: function () {
				if(this.mainModel.opType == 'create'){
                    this.mainModel.vo.compId = this.selectOrgId;
                    this.mainModel.vo.orgId = this.selectOrgId;
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