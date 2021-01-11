define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	var videoHelper = require("tools/videoHelper");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	
	//初始化数据模型
	var newVO = function() {
		return {
			//ID
			id : null,
			//
			code : null,
			//案例名称
			name : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//内容
			content : null,
			//是否禁用，0启用，1禁用
			disable : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
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
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require(""),
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.require("案例名称"),
						  LIB.formRuleMgr.length()
				],
				"compId" : [{required: true, message: '请选择所属公司'},
					LIB.formRuleMgr.length()
				],
				"content" : [LIB.formRuleMgr.require("内容"),
					LIB.formRuleMgr.length(500,1)
				],
				"disable" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		fileModel: {
			rightPic: {
				cfg: {
					params: {
						recordId: null,
						dataType: 'I3', //检查方法数据来源标识(正确)
						fileType: 'I',
					},
					filters: {
						max_file_size: '10mb',
						mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
					},
				},
				data: []
			},
			wrongPic: {
				cfg: {
					params:{
						recordId : null,
						dataType : 'I4',//事故案例数据来源标识（错误）
						fileType : 'I',
					},
					filters:{
						max_file_size: '10mb',
						mime_types: [{ title: "video", extensions: "mp4" }]
					},
				},
				data: []
			},
			referMater: {
				cfg: {
					params:{
						recordId : null,
						dataType : 'I5',
						fileType : 'I',
					},
					filters:{
						max_file_size: '10mb',
						mime_types: [{ title: "file", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt" }]
					},
				},
				data: []
			}
		},
	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	el
	 template
	 components
	 componentName
	 props
	 data
	 computed
	 watch
	 methods
	 events
	 vue组件声明周期方法
	 created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
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
			doEdit:function(){
				this.mainModel.opType = "update";
				this.mainModel.isReadOnly = false;
			},
			doCancel:function(){
				var _this = this;
				if(_this.mainModel.vo.id) {
					api.get({id : _this.mainModel.vo.id}).then(function(res){
						var data = res.data;
						_this.mainModel.vo = newVO();
						_.deepExtend(_this.mainModel.vo, data);
					});
				}
				_this.mainModel.isReadOnly = true;
				_this.afterInitData && _this.afterInitData();
			},
			beforeDoSave:function(){
				this.mainModel.vo.orgId = this.mainModel.vo.compId;
			},
		},
        init: function () {
            this.$api = api;
        }
	});

	return detail;
});