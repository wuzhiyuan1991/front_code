define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var positionSelectModal = require("componentsEx/selectTableModal/positionSelectModal");


	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//角色编码
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//
			compId : null,
			//组织id
			orgId : null,
			//事故类型
			accidentType : null,
			//控制措施
			controlMeasures : null,
			//应急处置措施
			emergencyMeasures : null,
			//急救电话
			emergencyTelephone : null,
			//火警电话
			fireTelephone : null,
			//风险评价等级 1高,2中,3低
			riskLevel : null,
			//风险等级模型
			riskModel : null,
			//风险点
			riskPoint : null,
			dominationArea:null,
			//危害因素(风险场景)
			scene : null,
			//状态 0:停用,1:启用
			state : null,
			//联系电话
			telephone : null,
			//责任人
			users : [],
			//责任岗位
			positions:[],
			pictures: [],
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
				// "disable" :LIB.formRuleMgr.require("状态"),
				// "compId" : [LIB.formRuleMgr.require("")],
				// "orgId" : [LIB.formRuleMgr.length(10)],
				"accidentType" : [{required: true, message: '事故类型'},LIB.formRuleMgr.length(500)],
				// "controlMeasures" : [LIB.formRuleMgr.length(65535)],
				"emergencyMeasures" : [{required: true, message: '应急处置措施'},LIB.formRuleMgr.length(1000)],
				"user" : [LIB.formRuleMgr.allowStrEmpty],
				// "emergencyTelephone" : [LIB.formRuleMgr.length(500)],
				// "fireTelephone" : [LIB.formRuleMgr.length(500)],
				// "riskLevel" : [LIB.formRuleMgr.length(10)],
				// "riskModel" : [LIB.formRuleMgr.length(1000)],
				// "riskPoint" : [LIB.formRuleMgr.length(1000)],
				// "scene" : [LIB.formRuleMgr.length(65535)],
				// "state" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"telephone" : [LIB.formRuleMgr.length(500)],
	        }
		},
		tableModel : {

		},
		formModel : {
		},
		selectModel : {
			userSelectModel: {
				visible: false,
				filterData:null,
			},
			positionSelectModel : {
				visible : false,
				filterData : null,
			}
		},

		fileModel: {
			safetyPic: {
				cfg: {
					params: {
						recordId: null,
						dataType: 'RC1', //安全标志 RC:RiskCard
						fileType: 'RC',
					},
					filters: {
						max_file_size: '10mb',
						mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
					},
				},
				data: []
			},
			riskPointPic: {
				cfg: {
					params: {
						recordId: null,
						dataType: 'RC2', //风险点图片
						fileType: 'RC',
					},
					filters: {
						max_file_size: '10mb',
						mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
					},
				},
				data: []
			},
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
			"userSelectModal": userSelectModal,
			"positionSelectModal":positionSelectModal,
        },
		data:function(){
			return dataModel;
		},
		computed: {
			riskColor:function(){
				var resultColor = _.propertyOf(JSON.parse(this.mainModel.vo.riskModel))("resultColor");
				if (resultColor) {
					return "<span style='background:\#" + resultColor + ";color:\#" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + this.mainModel.vo.riskLevel;
				} else {
					return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + this.mainModel.vo.riskLevel;
				}
			}
		},
		methods:{
			newVO : newVO,
			doDeleteFile: function (fileId, index, arrays) {
				var ids = [];
				ids[0] = fileId;

				LIB.Modal.confirm({
					title: '删除选中数据?',
					onOk: function () {
						api._deleteFile(null, ids).then(function (data) {
							if (data.data && data.error != '0') {
								LIB.Msg.warning("删除失败");
							} else {
								arrays.splice(index, 1);
								LIB.Msg.success("删除成功");
							}
						});
					}
				});
			},
			doShowPositionSelectModal : function() {
				this.selectModel.positionSelectModel.visible = true;
				// this.selectModel.positionSelectModel.filterData = ;
			},
			doSavePosition: function (selectedDatas) {
				if(selectedDatas){
					this.mainModel.vo.positions = _.union(this.mainModel.vo.positions,selectedDatas);
				}
			},
			doShowUserSelectModal: function(){
				// var excludeIds = [];
				// excludeIds.push(this.mainModel.vo.checkerId);
				// this.selectModal.userSelectModal.filterData = {"criteria.strsValue": JSON.stringify({excludeIds: excludeIds})};
				this.selectModel.userSelectModel.visible = true;

			},
			// 保存检查人
			doSaveUser: function (selectedDatas) {
				if(selectedDatas){
					this.mainModel.vo.users = _.union(this.mainModel.vo.users,selectedDatas);;
					var mobiles = _.pluck(this.mainModel.vo.users,"mobile");
					this.mainModel.vo.telephone = _.filter(mobiles,function(item){
						return item.length>0;
					}).join(",");
				}
			},

            // 保存检查人
            doRemoveUser: function () {
				var mobiles = _.pluck(this.mainModel.vo.users,"mobile");
				this.mainModel.vo.telephone = _.filter(mobiles,function(item){
					return item.length>0;
				}).join(",");
            },

			doSaveData: function(){
				var _this = this;
				api.codeUniq({id:this.mainModel.vo.id,code:this.mainModel.vo.code}).then(function(res){
					if(res.data != '0'){
						LIB.Msg.error("编码已存在");
						return;
					}
					_this.doSave();
				})
			},
			afterInitData : function() {
			},
			beforeInit : function() {
			},
            previews:function(){
				this.$emit('title-changed',this.mainModel.vo, this.fileModel)
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