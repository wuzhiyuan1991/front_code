define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var emerResourceSelectModal = require("componentsEx/selectTableModal/emerResourceSelectModal");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//编码
			code : null,
			//维护/保养数量
			maintQuantity : null,
			//作业类别 1:内部,2:外部
			operationType : null,
			//操作内容
			operationContent : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//类别 1:检修抢修,2:维护保养
			type : null,
			//维护/保养时间
			maintTime : null,
			//下次维护保养日期
			nextMaintTime : null,
			//作业操作人员
			operators : null,
			orgId: null,
			compId: null,
			//应急物资
			emerResource : {id:'', name:'', reqirement:'', specification:'', quantity:"", unit:'',dominationArea:{id:null, name:null}, location:null},
			//作业操作人员
			users : [],
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
				"operationType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("作业类别")),
				"operationContent" : [LIB.formRuleMgr.require("操作内容"),
						  LIB.formRuleMgr.length(500)
				],
				"operators" : [
					{	required: true,
						validator: function (rule, value, callback) {
						var vo = dataModel.mainModel.vo;
						if (vo.operationType == 2 && _.isEmpty(vo.operators)) {
							return callback(new Error('请填写作业操作人员'))
						}else if (vo.operationType == 1 && _.isEmpty(vo.users)) {
							return callback(new Error('请选择作业操作人员'))
						}
						return callback();
					}
				}
				],
				"type" : [LIB.formRuleMgr.require("类别")],
				"maintQuantity" : [
					{
						required: true,
						validator: function (rule, value, callback) {
							var vo = dataModel.mainModel.vo;
							if(_.isEmpty(value + "")) {
								return callback(new Error('请填写维护/保养数量'))
							} else if (parseFloat(value) > parseFloat(vo.emerResource.quantity)) {
								return callback(new Error('维护/保养数量不能超过应急资源数量'))
							} else if (parseFloat(value) <= 0) {
								return callback(new Error('维护/保养数量必须大于0'))
							}
							return callback();
						}
					}
				],
				"maintTime" : [LIB.formRuleMgr.require("维护/保养时间")],
				"nextMaintTime":[LIB.formRuleMgr.allowStrEmpty,{
					validator: function (rule, value, callback) {
						var vo = dataModel.mainModel.vo;
						if (!_.isEmpty(value) && !_.isEmpty(vo.maintTime) && new Date(value) <= new Date(vo.maintTime)) {
							return callback(new Error('必须大于维护/保养时间'))
						}
						return callback();
					}
				}],
				"emerResource.id" : [LIB.formRuleMgr.require("应急物资")],
	        }
		},
		tableModel : {
			userTableModel : LIB.Opts.extendDetailTableOpt({
				url : "emermaintrecord/users/list/{curPage}/{pageSize}",
				columns : [
					LIB.tableMgr.ksColumn.code,
				{
					title : "名称",
					fieldName : "name",
					keywordFilterName: "criteria.strValue.keyWordValue_name"
				},{
					title : "",
					fieldType : "tool",
					toolType : "del"
				}]
			}),
		},
		formModel : {
		},
		selectModel : {
			emerResourceSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			userSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},
		quantity: null,
		maintAll: false,
		isNextMaintTimeReadonly: true

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
			"userSelectModal":userSelectModal,
			
        },
		data:function(){
			return dataModel;
		},
		computed: {
			'maintQuantity': function() {
				return (parseFloat(this.mainModel.vo.maintQuantity) || "") + (this.mainModel.vo.emerResource.unit || "");
			}
		},
		watch: {
			'mainModel.vo.operationType':function(val) {
				if(val == 1) {
					this.mainModel.vo.operators = null;
				}else if(val == 2) {
					this.mainModel.vo.users = [];
				}
			},
			'mainModel.vo.emerResource.quantity':function(val) {
				this.quantity = (parseFloat(val) || "") + (this.mainModel.vo.emerResource.unit || "")
				if(this.maintAll && !this.mainModel.isReadOnly) {
					this.mainModel.vo.maintQuantity = parseFloat(val) || "";
				}
			},
			'mainModel.vo.maintQuantity':function(val) {
				if(!!val && !!this.mainModel.vo.emerResource.quantity && parseFloat(val) == parseFloat(this.mainModel.vo.emerResource.quantity)) {
					this.maintAll = true;
				}else{
					this.maintAll = false;
				}
			},
			'mainModel.vo.maintTime': function() {
				this._setNextMaintTime();
			}
		},
		methods:{
			newVO : newVO,
            beforeDoDelete:function () {
				this.mainModel.vo.orgId = LIB.user.orgId;
            },
			doShowEmerResourceSelectModal : function() {
				this.selectModel.emerResourceSelectModel.visible = true;
				this.selectModel.emerResourceSelectModel.filterData = {status:0};
			},
			doClearEmerRecource: function () {
				_.deepExtend(this.mainModel.vo.emerResource, newVO().emerResource);
			},
			doAllQuantityChange: function() {
				var vo = this.mainModel.vo;
				this.maintAll = !this.maintAll;
				if(this.maintAll && !!vo.emerResource.quantity) {
					vo.maintQuantity = parseFloat(vo.emerResource.quantity);
				}else{
					vo.maintQuantity = null;
				}
			},
			doSaveEmerResource : function(selectedDatas) {
				if (selectedDatas) {
					// _.deepExtend(this.mainModel.vo.emerResource, selectedDatas[0])
                    this.mainModel.vo.emerResource = selectedDatas[0];
					this.mainModel.vo.orgId = selectedDatas[0].orgId;
					this.mainModel.vo.compId = selectedDatas[0].compId;
					this._setNextMaintTime();
				}
			},
			_setNextMaintTime: function() {
				var emerResource = this.mainModel.vo.emerResource;
				if(emerResource.maintPeriod && emerResource.maintPeriodUnit && this.mainModel.vo.maintTime) {
					this.isNextMaintTimeReadonly = true;
					if(emerResource.maintPeriodUnit == 1) {//天
						this.mainModel.vo.nextMaintTime = new Date(new Date(this.mainModel.vo.maintTime).setDate(new Date(this.mainModel.vo.maintTime).getDate() + parseInt(emerResource.maintPeriod))).Format("yyyy-MM-dd 00:00:00");
					}else if(emerResource.maintPeriodUnit == 2) {//月
						this.mainModel.vo.nextMaintTime = new Date(new Date(this.mainModel.vo.maintTime).setMonth(new Date(this.mainModel.vo.maintTime).getMonth() + parseInt(emerResource.maintPeriod))).Format("yyyy-MM-dd 00:00:00");
					}else if(emerResource.maintPeriodUnit == 3) {//年
						this.mainModel.vo.nextMaintTime = new Date(new Date(this.mainModel.vo.maintTime).setYear(new Date(this.mainModel.vo.maintTime).getYear() + parseInt(emerResource.maintPeriod))).Format("yyyy-MM-dd 00:00:00");
					}
				}else  if(!emerResource.maintPeriod ||  !emerResource.maintPeriodUnit) {
					if(!this.mainModel.isReadOnly) {
						this.mainModel.vo.nextMaintTime = null;
					}
					this.isNextMaintTimeReadonly = false;
				}
			},
			doShowUserSelectModal : function() {
				this.selectModel.userSelectModel.visible = true;
				//this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveUsers : function(selectedDatas) {
				var _this = this;
				if (selectedDatas) {
					//两数组去重
					if (_this.mainModel.vo.users.length > 0) {
						_.each(_this.mainModel.vo.users, function (data) {
							_.each(selectedDatas, function (item, index) {
								if (item.id == data.id) {
									//_this.mainModel.vo.examPoints.splice(index,1);
									selectedDatas.splice(index, 1);
									return false
								}
							})
						})
					}
					_this.mainModel.vo.users = _this.mainModel.vo.users.concat(selectedDatas);
				}
			},
			doRemoveUser : function(index) {
				this.mainModel.vo.users.splice(index, 1);
			},
			afterInitData : function() {
				if(!!this.mainModel.vo.maintQuantity) {
					this.mainModel.vo.maintQuantity = parseFloat(this.mainModel.vo.maintQuantity) || "";
				}
			},
			beforeInit : function() {
			},

		},
		events : {
		},
    	init: function(){
        	this.$api = api;
		},
	});

	return detail;
});