define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var emerResourceSelectModal = require("componentsEx/selectTableModal/emerResourceSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//编码
			code : null,
			//检验检测量
			inspectQuantity : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//检验/检测内容
			inspectionContent : null,
			//检验/检测机构
			inspectOrgan : null,
			//检验检测时间
			inspectTime : null,
			//检验/检测人员
			inspectors : null,
			orgId:null,
			compId:null,
			//应急物资
			emerResource : {id:'', name:'', reqirement:'', specification:'', quantity:"", unit:'',dominationArea:{id:null, name:null}, location:null},
			//下次检测时间
			nextInspectTime:null,
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
				"inspectQuantity" : [
					{
						required: true,
						validator: function (rule, value, callback) {
							var vo = dataModel.mainModel.vo;
							if(_.isEmpty(value + "")) {
								return callback(new Error('请填写检验检测量'))
							} else if (parseFloat(value) > parseFloat(vo.emerResource.quantity)) {
								return callback(new Error('检验检测量不能超过应急资源数量'))
							} else if (parseFloat(value) <= 0) {
								return callback(new Error('检验检测量必须大于0'))
							}
							return callback();
						}
					}
				],
				"inspectionContent" : [LIB.formRuleMgr.require("检验/检测内容"),
						  LIB.formRuleMgr.length(500)
				],
				"inspectOrgan" : [LIB.formRuleMgr.require("检验/检测机构"),
						  LIB.formRuleMgr.length(200)
				],
				"inspectTime" : [LIB.formRuleMgr.require("检验检测时间")],
				"nextInspectTime":[LIB.formRuleMgr.allowStrEmpty, {
					validator: function (rule, value, callback) {
						var vo = dataModel.mainModel.vo;
						if (!_.isEmpty(value) && !_.isEmpty(vo.inspectTime) && new Date(value) <= new Date(vo.inspectTime)) {
							return callback(new Error('必须大于检验检测时间'))
						}
						return callback();
					}
				}],
				"inspectors" : [LIB.formRuleMgr.allowIntEmpty, LIB.formRuleMgr.length(200)],
				"emerResource.id" : [LIB.formRuleMgr.require("应急物资")],
	        }
		},
		tableModel : {
		},
		formModel : {
		},
		selectModel : {
			emerResourceSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},
		quantity: null,
		inspectAll: false,
		isNextInspectTimeReadonly:true
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
			"emerresourceSelectModal":emerResourceSelectModal,
			
        },
		data:function(){
			return dataModel;
		},
		computed: {
			'inspectQuantity': function() {
				return (parseFloat(this.mainModel.vo.inspectQuantity) || "") + (this.mainModel.vo.emerResource.unit || "");
			}
		},
		watch: {
			'mainModel.vo.emerResource.quantity':function(val) {
				this.quantity = (parseFloat(val) || "") + (this.mainModel.vo.emerResource.unit || "")
				if(this.inspectAll && !this.mainModel.isReadOnly) {
					this.mainModel.vo.inspectQuantity = parseFloat(val) || "";
				}
			},
			'mainModel.vo.inspectQuantity':function(val) {
				if(!!val && !!this.mainModel.vo.emerResource.quantity && parseFloat(val) == parseFloat(this.mainModel.vo.emerResource.quantity)) {
					this.inspectAll = true;
				}else{
					this.inspectAll = false;
				}
			},
			'mainModel.vo.inspectTime': function() {
				this._setNextInspectTime();
			}
		},
		methods:{
			newVO : newVO,
			doShowEmerResourceSelectModal : function() {
				this.selectModel.emerResourceSelectModel.visible = true;
				this.selectModel.emerResourceSelectModel.filterData = {status:0};
			},
			doClearEmerRecource: function () {
				_.deepExtend(this.mainModel.vo.emerResource, newVO().emerResource);
			},
			doAllQuantityChange: function() {
				var vo = this.mainModel.vo;
				this.inspectAll = !this.inspectAll;
				if(this.inspectAll && !!vo.emerResource.quantity) {
					vo.inspectQuantity = parseFloat(vo.emerResource.quantity);
				}else{
					vo.inspectQuantity = null;
				}
			},
			doSaveEmerResource : function(selectedDatas) {
				if (selectedDatas) {
					_.deepExtend(this.mainModel.vo.emerResource, selectedDatas[0])
					this.mainModel.vo.orgId = selectedDatas[0].orgId;
					this.mainModel.vo.compId = selectedDatas[0].compId;
					this._setNextInspectTime();
				}
			},
			_setNextInspectTime: function() {
				var emerResource = this.mainModel.vo.emerResource;
				if(emerResource.inspectPeriod && emerResource.inspectPeriodUnit && this.mainModel.vo.inspectTime) {
					this.isNextInspectTimeReadonly = true;
					if(emerResource.inspectPeriodUnit == 1) {//天
						this.mainModel.vo.nextInspectTime = new Date(new Date(this.mainModel.vo.inspectTime).setDate(new Date(this.mainModel.vo.inspectTime).getDate() + parseInt(emerResource.inspectPeriod))).Format("yyyy-MM-dd 00:00:00");
					}else if(emerResource.inspectPeriodUnit == 2) {//月
						this.mainModel.vo.nextInspectTime = new Date(new Date(this.mainModel.vo.inspectTime).setMonth(new Date(this.mainModel.vo.inspectTime).getMonth() + parseInt(emerResource.inspectPeriod))).Format("yyyy-MM-dd 00:00:00");
					}else if(emerResource.inspectPeriodUnit == 3) {//年
						this.mainModel.vo.nextInspectTime = new Date(new Date(this.mainModel.vo.inspectTime).setYear(new Date(this.mainModel.vo.inspectTime).getYear() + parseInt(emerResource.inspectPeriod))).Format("yyyy-MM-dd 00:00:00");
					}
				}else  if(!emerResource.inspectPeriod ||  !emerResource.inspectPeriodUnit) {
					if(!this.mainModel.isReadOnly) {
						this.mainModel.vo.nextInspectTime = null;
					}
					this.isNextInspectTimeReadonly = false;
				}
			},
			afterInitData : function() {
				if(!!this.mainModel.vo.inspectQuantity) {
					this.mainModel.vo.inspectQuantity = parseFloat(this.mainModel.vo.inspectQuantity) || "";
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