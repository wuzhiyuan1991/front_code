define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var emerInspectRecordFormModal = require("componentsEx/formModal/emerInspectRecordFormModal");
	var emerMaintRecordFormModal = require("componentsEx/formModal/emerMaintRecordFormModal");
    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");

    //初始化数据模型
	var newVO = function() {
		return {
			attr1:null,
			id : null,
			//编码
			code : null,
			//名称
			name : null,
			//状态 0:在用,1:停用,2:报废
			status : '0',
			//存储地点
			location : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//单位
			unit : null,
			//数量
			quantity : null,
			//分类 1:作业场所配备,2:个人防护装备,3:救援车辆配备,4:救援物资配备
			type : null,
			//联系电话
			contactNumber : null,
			//
			remark : null,
			//技术要求或功能要求
			reqirement : null,
			//抢险救援物资种类 1:侦检,2:警戒,3:灭火,4:通信,5:救生,6:破拆,7:堵漏,8:输转,9:洗消,10:排烟,11:照明,12:其他
			rescueSupplyCategory : null,
			//抢险救援车辆种类 1:灭火抢险救援车,2:举高抢险救援车,3:专勤抢险救援车,4:后勤抢险救援车
			rescueVehicleCategory : null,
			//规格型号
			specification : null,
			managerId:null,
			//现场负责人
			user : {id:null, name:null},
			//有效期
			validPeriod : null,
			//车间负责人联系方式
			workshopLeaderNumber : null,
			//车间负责人
			workshopLeaderId : null,
			workshopLeader : {id:null, name:null},
			//检验检测清单
			emerInspectRecords : [],
			//维修保养清单
			emerMaintRecords : [],
			orgId : LIB.user.compId,
			compId : LIB.user.compId,
			// 属地
			dominationArea:{id:null, name:null},
			//维护保养周期
			maintPeriod : null,
			//维护保养周期单位 1:天,2:月,3:年
			maintPeriodUnit : '1',
			//下次维护保养日期
			nextMaintTime : null,
			//维护保养到期提前提醒时间
			maintNoticeTime : null,
			//维护保养提前提醒时间单位 1:天,2:月
			maintNoticeTimeUnit : '1',

			//检验检测到期提前提醒时间
			inspectNoticeTime : null,
			//检验检测提前提醒时间单位 1:天,2:月
			inspectNoticeTimeUnit : '1',
			//检验检测周期
			inspectPeriod : null,
			//检验检测周期单位 1:天,2:月,3:年
			inspectPeriodUnit : '1',
			//下次检验检测日期
			nextInspectTime : null,


			

		}
	};

	//Vue数据
	var dataModel = {
		optType:0,
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			users:[],
            workshopLeader:[],
          //  1:侦检,2:警戒,3:灭火,4:通信,5:救生,6:破拆,7:堵漏,8:输转,9:洗消,10:排烟,11:照明,12:其他
            rescueSupplyCategory:[
				{id:"1", value:'侦检'},
                {id:"2", value:'警戒'},
                {id:"3", value:'灭火'},
				{id:"4", value:'通信'},
				{id:"5", value:'救生'},
                {id:"6", value:'破拆'},
                {id:"7", value:'堵漏'},
                {id:"8", value:'输转'},
                {id:"9", value:'洗消'},
                {id:"10", value:'排烟'},
                {id:"11", value:'照明'},
                {id:"12", value:'其他'},
			],
            //抢险救援车辆种类 1:灭火抢险救援车,2:举高抢险救援车,3:专勤抢险救援车,4:后勤抢险救援车
            rescueVehicleCategory : [
                {id:"1", value:'灭火抢险救援车'},
                {id:"2", value:'举高抢险救援车'},
                {id:"3", value:'专勤抢险救援车'},
                {id:"4", value:'后勤抢险救援车'},
			],
			//验证规则
	        rules:{
				"workshopLeaderNumber":[],
				"workshopLeader":[LIB.formRuleMgr.allowIntEmpty],
				"code" : [LIB.formRuleMgr.length(100)],
				"name" : [LIB.formRuleMgr.require("名称"),
						  LIB.formRuleMgr.length(50)
				],
				"status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("状态")),
				"location" : [LIB.formRuleMgr.length(200)],
				"disable" :LIB.formRuleMgr.require("状态"),
				"unit" : [LIB.formRuleMgr.require("单位"),
						  LIB.formRuleMgr.length(10)
				],  //detail

				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("分类")),
				"contactNumber" : [LIB.formRuleMgr.length(100)],
				"remark" : [LIB.formRuleMgr.length(500)],
				"reqirement" : [LIB.formRuleMgr.length(200)],
				"rescueSupplyCategory" : [LIB.formRuleMgr.allowIntEmpty,LIB.formRuleMgr.require("种类")],
				"rescueVehicleCategory" : [LIB.formRuleMgr.allowIntEmpty,LIB.formRuleMgr.require("种类")],
				"specification" : [LIB.formRuleMgr.length(200)],
				"managerId" : [LIB.formRuleMgr.allowStrEmpty],
				"dominationArea.id": [LIB.formRuleMgr.allowStrEmpty],
				"nextMaintTime":[LIB.formRuleMgr.allowStrEmpty],
				"nextInspectTime":[LIB.formRuleMgr.allowStrEmpty],
				"maintPeriod":[LIB.formRuleMgr.allowIntEmpty,
					{
						validator: function (rule, value, callback) {
							if(_.isEmpty(value)) {
								return callback();
							}
							var error = [];
							if(value <= 0) {
								error.push("不能小于0");
							}else if (value.indexOf('.') > -1) {
								error.push("请输入整数");
							}
							else if (dataModel.mainModel.vo.maintPeriodUnit == 1 && value > 36500) {
								error.push("不能超过36500天");
							}
							else if (dataModel.mainModel.vo.maintPeriodUnit == 2 && value > 1200) {
								error.push("不能超过1200月");
							}
							else if (dataModel.mainModel.vo.maintPeriodUnit == 3 && value > 100) {
								error.push("不能超过100年");
							}
							callback(error);
						}
					}
				],
				"maintNoticeTime":[LIB.formRuleMgr.allowIntEmpty,
					{
						validator: function (rule, value, callback) {
							if(_.isEmpty(value)) {
								return callback();
							}
							var error = [];
							if( value <= 0) {
								error.push("不能小于0");
							}else if (value.indexOf('.') > -1) {
								error.push("请输入整数");
							}
							else if (dataModel.mainModel.vo.maintNoticeTimeUnit == 1 && value > 36500) {
								error.push("不能超过36500天");
							}
							else if (dataModel.mainModel.vo.maintNoticeTimeUnit == 2 && value > 1200) {
								error.push("不能超过1200月");
							}
							callback(error);
						}
					}
				],
				"inspectPeriod":[LIB.formRuleMgr.allowIntEmpty,
					{
						validator: function (rule, value, callback) {
							if(_.isEmpty(value)) {
								return callback();
							}
							var error = [];
							if(value <= 0) {
								error.push("不能小于0");
							}else if (value.indexOf('.') > -1) {
								error.push("请输入整数");
							}
							else if (dataModel.mainModel.vo.inspectPeriodUnit == 1 && value > 36500) {
								error.push("不能超过36500天");
							}
							else if (dataModel.mainModel.vo.inspectPeriodUnit == 2 && value > 1200) {
								error.push("不能超过1200月");
							}
							else if (dataModel.mainModel.vo.inspectPeriodUnit == 3 && value > 100) {
								error.push("不能超过100年");
							}
							callback(error);
						}
					}
				],
				"inspectNoticeTime":[LIB.formRuleMgr.allowIntEmpty,
					{
						validator: function (rule, value, callback) {
							if(_.isEmpty(value)) {
								return callback();
							}
							var error = [];
							if( value <= 0) {
								error.push("不能小于0");
							}else if (value.indexOf('.') > -1) {
								error.push("请输入整数");
							}
							else if (dataModel.mainModel.vo.inspectNoticeTimeUnit == 1 && value > 36500) {
								error.push("不能超过36500天");
							}
							else if (dataModel.mainModel.vo.inspectNoticeTimeUnit == 2 && value > 1200) {
								error.push("不能超过1200月");
							}
							callback(error);
						}
					}
				],

                 
				"quantity":[{required:true,validator:function(rule, value, callback){
                    // var a =  /^-?[1-9]\d*$/.test(value);
                    var a =  /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(String(value));

                    if(value <= 0){
                        return callback(new Error("请输入大于0的数"));
                    }

                    if(a){
                        if(dataModel.mainModel.vo.unit){
                            if(dataModel.mainModel.vo.unit.length>10){
                                callback("单位请限制在10字符内")
							}
                            return callback();
                        }else{
                            return callback("请填写单位")
                        }
                    }else{
                        return callback(new Error("请输入两位小数"));
                    }
				}}],

              


	        }
		},
		tableModel : {
            emerMaintRecordTableModel : LIB.Opts.extendDetailTableOpt({
                url : "emerresource/emermaintrecords/list/{curPage}/{pageSize}?type=1",
                columns : [
                    // LIB.tableMgr.column.cb,
                    {
                        title:'',
                        fieldType:'sequence',
                        width:50
                    },
                    {
                        title : "维修时间",
                        fieldName : "name",
                        render:function (data) {
                            if(data.maintTime){
                                return (data.maintTime + '').substring(0,16)
                            }else{
                                return '';
                            }
                        }
                    },
                    {
                        title : "作业类别",
                        fieldName : "operationType",
						render:function (data) {
							if(data.operationType){
								return LIB.getDataDic("is_inside", data.operationType);
							}
							return '';
                        }
                    },
                    {
                        title : "数量",
                        fieldName : "maintQuantity",
                    },
                    {
                        title : "操作人员",
                        fieldName : "operators",
                    },
                    {
                        title : "作业内容",
                        fieldName : "operationContent",
                    },
                ]
            }),

            emerMaintRecordTableModel2 : LIB.Opts.extendDetailTableOpt({
                url : "emerresource/emermaintrecords/list/{curPage}/{pageSize}?type=2",
                columns : [
                    // LIB.tableMgr.column.cb,
                    {
                        title:'',
                        fieldType:'sequence',
                        width:50
                    },
                    {
                        title : "保养时间",
                        fieldName : "name",
                        render:function (data) {
                            if(data.maintTime){
                                return (data.maintTime + '').substring(0,16)
                            }else{
                                return '';
                            }
                        }
                    },
                    {
                        title : "作业类别",
                        fieldName : "operationType",
                        render:function (data) {
                            if(data.operationType){
                                return LIB.getDataDic("is_inside", data.operationType);
                            }
                            return '';
                        }
                    },
                    {
                        title : "数量",
                        fieldName : "maintQuantity",
                    },
                    {
                        title : "操作人员",
                        fieldName : "operators",
                    },
                    {
                        title : "作业内容",
                        fieldName : "operationContent",
                    },
                ]
            }),

            emerInspectRecordTableModel : LIB.Opts.extendDetailTableOpt({
				url : "emerresource/emerinspectrecords/list/{curPage}/{pageSize}",
                // url : "emerresource/emermaintrecords/list/{curPage}/{pageSize}",
				columns : [
					// LIB.tableMgr.ksColumn.code,
                    // LIB.tableMgr.column.cb,
                    {
                        title:'',
                        fieldType:'sequence',
						width:50
                    },
					{
						title : "检验检测时间",
						fieldName : "inspectTime",
                        render:function (data) {
                            if(data.inspectTime){
                                return (data.inspectTime + '').substring(0,16)
                            }else{
                                return '';
                            }
                        }

					},
                    {
                        title : "数量",
                        fieldName : "inspectQuantity",
                    },
                    {
                        title : "检验检测机构",
                        fieldName : "inspectOrgan",
                    },
                    {
                        title : "检验检测人员",
                        fieldName : "inspectors",
                    },
                    {
                        title : "检验检测内容",
                        fieldName : "inspectionContent",
                    },
				]
			}),
		},
		formModel : {
			emerInspectRecordFormModel : {
				show : false,
				hiddenFields : ["resourceId"],
				queryUrl : "emerresource/{id}/emerinspectrecord/{emerInspectRecordId}"
			},
			emerMaintRecordFormModel : {
				show : false,
				hiddenFields : ["resourceId"],
				queryUrl : "emerresource/{id}/emermaintrecord/{emerMaintRecordId}"
			},
		},
		selectModel : {
			userSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
            dominationAreaSelectModel:{
				visible:false,
                filterData : {orgId : null}
			}
		},
        activeTabId:"1",
        tabs: [
            {
                id: '1',
                name: "检修抢修"
            },
            {
                id: '2',
                name: '保养信息'
            },
			{
				id: '3',
				name: '检验检测'
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
			"userSelectModal":userSelectModal,
			"emerinspectrecordFormModal":emerInspectRecordFormModal,
			"emermaintrecordFormModal":emerMaintRecordFormModal,
            "dominationareaSelectModal":dominationAreaSelectModal,
        },



		computed: {
            userInfo:function(){
                if(this.mainModel.vo.user && this.mainModel.vo.user.id){
                    return [this.mainModel.vo.user];
                }
                return ''
			},
            workshopLeader:function () {
                if(this.mainModel.vo.workshopLeader && this.mainModel.vo.workshopLeader.id){
                    return [this.mainModel.vo.workshopLeader];
                }
                return ''
            }

        },
		props:{
            comid:{
            	type:String,
				default:null
			},
            checkedGroupIndex:{
                type:Number,
                default:null
			},
			index:{
            	type:Number,
				default:0
			}
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,

            doSaveDominationArea : function(selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.dominationArea = selectedDatas[0];
                    this.mainModel.vo.dominationAreaId = selectedDatas[0].id;
                    if(!this.mainModel.vo.specificAddress) {
                        this.mainModel.vo.specificAddress = selectedDatas[0].name;
                    }
                }
            },

            doSaveUser : function(selectedDatas) {
                if (selectedDatas) {
                	if(this.optType == 0){
                        this.mainModel.vo.user = {id:selectedDatas[0].id, name:selectedDatas[0].username};
                        this.mainModel.vo.managerId = selectedDatas[0].id;
                        this.mainModel.users = selectedDatas;
                        this.mainModel.vo.contactNumber = selectedDatas[0].mobile;
					}
					if(this.optType == 1){
                        this.mainModel.vo.workshopLeader = {id:selectedDatas[0].id, name:selectedDatas[0].username};
                        this.mainModel.vo.workshopLeaderId = selectedDatas[0].id;
                        this.mainModel.workshopLeader = selectedDatas;
                        this.mainModel.vo.workshopLeaderNumber = selectedDatas[0].mobile;
					}

                }
            },

			// 选择属地
            doShowDominationAreaSelectModal : function() {

                this.selectModel.dominationAreaSelectModel.filterData = {orgId : this.mainModel.vo.compId};
                this.selectModel.dominationAreaSelectModel.visible = true;
			},

            doTabClick:function (id) {
				this.activeTabId = id;
            },
			doShowUserSelectModal : function(val) {
				this.optType = val;
				this.selectModel.userSelectModel.visible = true;
				this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
            doRemoveUserSelectModal:function (val) {
				if(val == 0){
                    this.mainModel.vo.user = null;
                    this.mainModel.vo.managerId = null;
                    this.mainModel.vo.contactNumber = '';
				}else if(val == 1){
                    this.mainModel.vo.workshopLeader =null;
                    this.mainModel.vo.workshopLeaderId = null;
                    this.workshopLeader = null;
                    this.mainModel.vo.workshopLeaderNumber = null;
				}
            },
			// doSaveUsers : function(selectedDatas) {
			// 	if (selectedDatas) {
			// 		this.mainModel.vo.user = selectedDatas[0];
			// 	}
			// },
			doShowEmerInspectRecordFormModal4Update : function(param) {
				this.formModel.emerInspectRecordFormModel.show = true;
				this.$refs.emerinspectrecordFormModal.init("update", {id: this.mainModel.vo.id, emerInspectRecordId: param.entry.data.id});
			},
			doShowEmerInspectRecordFormModal4Create : function(param) {
				this.formModel.emerInspectRecordFormModel.show = true;
				this.$refs.emerinspectrecordFormModal.init("create");
			},
			doSaveEmerInspectRecord : function(data) {
				if (data) {
					var _this = this;
					api.saveEmerInspectRecord({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.emerinspectrecordTable);
					});
				}
			},
			doUpdateEmerInspectRecord : function(data) {
				if (data) {
					var _this = this;
					api.updateEmerInspectRecord({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.emerinspectrecordTable);
					});
				}
			},
			doRemoveEmerInspectRecord : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeEmerInspectRecords({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.emerinspectrecordTable.doRefresh();
						});
					}
				});
			},
			doShowEmerMaintRecordFormModal4Update : function(param) {
				this.formModel.emerMaintRecordFormModel.show = true;
				this.$refs.emermaintrecordFormModal.init("update", {id: this.mainModel.vo.id, emerMaintRecordId: param.entry.data.id});
			},
			doShowEmerMaintRecordFormModal4Create : function(param) {
				this.formModel.emerMaintRecordFormModel.show = true;
				this.$refs.emermaintrecordFormModal.init("create");
			},
			doSaveEmerMaintRecord : function(data) {
				if (data) {
					var _this = this;
					api.saveEmerMaintRecord({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.emermaintrecordTable);
					});
				}
			},
			doUpdateEmerMaintRecord : function(data) {
				if (data) {
					var _this = this;
					api.updateEmerMaintRecord({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.emermaintrecordTable);
					});
				}
			},
			doRemoveEmerMaintRecord : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeEmerMaintRecords({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.emermaintrecordTable.doRefresh();
						});
					}
				});
			},
			afterInitData : function() {
				this.mainModel.vo.quantity = parseInt(this.mainModel.vo.quantity);
				this.$refs.emerinspectrecordTable.doQuery({id : this.mainModel.vo.id});
				this.$refs.emermaintrecordTable.doQuery({id : this.mainModel.vo.id});
                this.$refs.emermaintrecordTable2.doQuery({id : this.mainModel.vo.id});
            },
            beforeDoSave:function () {
                this.mainModel.vo.type = this.checkedGroupIndex;
                // this.mainModel.vo.unit = LIB.user.username;
            },

			beforeInit : function() {
				this.mainModel.rules["dominationArea.id"] = [this.mainModel.rules["dominationArea.id"][0]];
                this.mainModel.rules.location = [this.mainModel.rules.location[0]]
				if(this.index == 0){
                    this.mainModel.rules["dominationArea.id"].push(LIB.formRuleMgr.require("属地"))
                    this.mainModel.rules.location.push(LIB.formRuleMgr.require("储存地点"));
				}

				this.$refs.emerinspectrecordTable.doClearData();
				this.$refs.emermaintrecordTable.doClearData();
                this.$refs.emermaintrecordTable2.doClearData();

                this.mainModel.vo = newVO();
				this.mainModel.vo.type = this.checkedGroupIndex;
                this.selectModel.dominationAreaSelectModel.filterData = {orgId : this.mainModel.vo.compId};
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