define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");

	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//文件编码
			code : null,
			//隐患描述
			problem : null,
			//
			compId : null,
			//
			orgId : null,
			//依据条款
			checkBasic : null,
			//检查人依据
			reason : null,
			punishment:null,
			cloudfiles:[]
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
				"problem" : [LIB.formRuleMgr.require("隐患描述"),
						  LIB.formRuleMgr.length(500)
				],
				"compId" : [LIB.formRuleMgr.require("")],
				"orgId" : [LIB.formRuleMgr.length(20)],
				"checkBasic" : [LIB.formRuleMgr.length(500)],
				"reason" : [LIB.formRuleMgr.length(2000)],
				"cloudfiles":[ { required: true, validator: function (rule, value, callback) {
						var errors = [];
						if (_.isNull(dataModel.fileModel.pic.data) || dataModel.fileModel.pic.data.length == 0) {
							errors.push("请上传图片");
						}
						callback(errors);
					}
				}]
	        }
		},



//无需附件上传请删除此段代码
         fileModel:{
             // file : {
             //     cfg: {
             //         params: {
             //             recordId: null,
             //             dataType: 'XXX1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
             //             fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
             //         },
             //         filters: {
             //            max_file_size: '10mb',
             //         },
             //     },
             //     data : []
             // },
             pic : {
                 cfg: {
                     params: {
                         recordId: null,
                         dataType: 'ICM2', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
                         fileType: 'ICM'    // 文件类型标识，需要根据数据库的注释进行对应的修改
                     },
                     filters: {
                         max_file_size: '10mb',
                         mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
                     }
                 },
                 data : []
             }
             // ,
             // video : {
             //     cfg: {
             //         params: {
             //             recordId: null,
             //             dataType: 'XXX3', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
             //             fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
             //         },
             //         filters: {
             //             max_file_size: '10mb',
             //             mime_types: [{title: "files", extensions: "mp4,avi,flv,3gp"}]
             //         }
             //     },
             //     data : []
             // }
         }


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
			doRefreshImg: function(){
				this.$dispatch('ev_dtUpdate')
			},
			afterInit: function () {
				var _this = this;
				if (this.mainModel.opType === 'create') {
					debugger
					api.getUUID().then(function (res) {
						_this.mainModel.vo.id = res.data;
						_this.fileModel.pic.cfg.params.recordId = res.data;
					})
				}
			},
			afterInitFileData:function (data) {
				var _this = this;
				var fileTypeMap = {};
				_.each(_this.fileModel,function (item) {
					_.propertyOf(item)("cfg.params.dataType") && (fileTypeMap[item.cfg.params.dataType] = item);
				});
				var result = _.sortBy(data, function (item) {
					return parseInt(item.orderNo);
				});
				
				_.each(result, function (file) {
					var fm = fileTypeMap[file.dataType];
					if(fm) {
						fm.data.push(LIB.convertFileData(file));
					}
				});
			}
		},
		events : {
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});