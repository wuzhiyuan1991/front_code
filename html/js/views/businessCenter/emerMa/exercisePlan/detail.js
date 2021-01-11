define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	
	//初始化数据模型doClearData
	var newVO = function() {
		return {
			id : null,
			//编码
			code : null,
			//状态 0:未发布,1:已发布,2:已失效
			status : '0',
			//参演人数（人）
			participantNumber : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//演练形式 1:桌面推演,2:现场演习,3:自行拟定
			form : null,
			//演练时间
			exerciseTime : "2018-10-10 10:10:10",
            exerciseStartDate:null,
            exerciseEndDate:null,
			//演练科目
			subjects : null,
			//演练具体地点(默认取属地地址)
			specificAddress : null,
			//预案所在部门
			emerPlanDept : null,
			//预案类型 1:综合应急预案,2:专项应急预案,3:现场处置方案
			emerPlanType : null,
			//参演部门/岗位
			participant : null,
			//演练科目类型
			subjectType : [],
			//计划年份
			year : new Date().getFullYear() + "",
			//所属公司id
			compId : LIB.user.compId,
			//所属部门id
			orgId : LIB.user.compId,
			//备注
			remark : null,
			//属地
			dominationArea : {id:'', name:''},
			//演练负责人
			users : [],
            usersList:[],
			attr1:null
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			id:null,
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			usersList:[],
            subjectType:[], //演练科目类型
			//验证规则
	        rules:{
				"code" : [LIB.formRuleMgr.length(100)],
				"participantNumber" : LIB.formRuleMgr.range(1).concat(LIB.formRuleMgr.require("参演人数（人）")),
				"form" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("演练形式")),
				"exerciseStartDate" : [LIB.formRuleMgr.require("演练日期"),
						  LIB.formRuleMgr.length(20)
				],
                "exerciseEndDate" : [LIB.formRuleMgr.require("演练实施截止日期"),
                    LIB.formRuleMgr.length(20)
                ],
				"subjects" : [LIB.formRuleMgr.require("演练科目"),
						  LIB.formRuleMgr.length(200)
				],
				"specificAddress" : [LIB.formRuleMgr.require("演练具体地点(默认取属地地址)"),
						  LIB.formRuleMgr.length(100)
				],
				"emerPlanDept" : [LIB.formRuleMgr.require("预案所在部门"),
						  LIB.formRuleMgr.length(200)
				],
				"emerPlanType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("预案类型")),
				"participant" : [LIB.formRuleMgr.require("参演部门/岗位"),
						  LIB.formRuleMgr.length(200)
				],
				"subjectType" : [LIB.formRuleMgr.require("演练科目类型"),
						  LIB.formRuleMgr.length(100)
				],
				"year" : [LIB.formRuleMgr.require("计划年份")],
				"remark" : [LIB.formRuleMgr.length(500)],
				// "dominationArea.id" : [LIB.formRuleMgr.require("属地")],
				"dominationArea.id":[{required:true,validator:function(rule, value, callback){
					if(!dataModel.mainModel.vo.dominationArea.id){
                       return  callback("请选择演练地点");
					}
					if(!dataModel.mainModel.vo.specificAddress){
						return callback("请选填写演练地点");
					}
					if(dataModel.mainModel.vo.specificAddress.length>100){
                        return callback("填写的内容超出100个字符");
                    }
					return callback();
                }}]
	        }
		},
		tableModel : {
			userTableModel : LIB.Opts.extendDetailTableOpt({
				url : "exerciseplan/users/list/{curPage}/{pageSize}",
				columns : [
					{
						title: "姓名",
						fieldName: "username",
						width: 100
					},
					{
						title: "手机",
						fieldName: "mobile",
						width: 150
					},
					{
						title: "岗位",
						fieldType: "custom",
						render: function (data) {
							if (_.propertyOf(data)("positionList")) {
								var posNames = "";
								data.positionList.forEach(function (e) {
									if (e.postType == 0) {
										posNames += (e.name + ",");
									}
								});
								posNames = posNames.substr(0, posNames.length - 1);
								return posNames;

							}
						},
						width: 200
					},
					_.extend(_.extend({}, LIB.tableMgr.column.company), {filterType: null}),
					_.extend(_.extend({}, LIB.tableMgr.column.dept), {filterType: null}),
					{
						title: "",
						fieldType: "tool",
						toolType: "del"
					}]
			}),
		},
		formModel : {
		},
		selectModel : {
			dominationAreaSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			userSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},
		publishSuccessModel: {
			visible: false,
			title: "发布成功"
		},
		yearList:[],
		exerciseTime:null

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
			"dominationareaSelectModal":dominationAreaSelectModal,
			"userSelectModal":userSelectModal,
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,

            changeQryYear: function(year) {
				this.mainModel.vo.year = year;
			},
			doPublish: function() {
				var _this = this;
				api.publish({id: _this.mainModel.vo.id, orgId:_this.mainModel.vo.orgId}).then(function (res) {
					_this.$dispatch("ev_dtUpdate");
					_this.publishSuccessModel.visible = true;
                    LIB.Msg.info("发布成功");
                    _this.mainModel.vo.status = "1";
				});
			},
            changeSubjectType:function (val) {
				if(val && val.length>0){
                    this.mainModel.vo.subjectType = val.toString();
				}else{
                    this.mainModel.vo.subjectType = ''
				}

            },
			doConfirm: function() {
				this.publishSuccessModel.visible = false;
			},
			doCreateScheme: function() {
				window.isClickCreateSchemeBtn = true;
				var routerPart = "/emer/businessCenter/exerciseScheme?method=create&exercisePlanId=" + this.mainModel.vo.id;
				this.$router.go(routerPart);
				this.publishSuccessModel.visible = false;
			},
			doInvalid: function() {
				var _this = this;
				api.invalid({id: _this.mainModel.vo.id, orgId:_this.mainModel.vo.orgId}).then(function (res) {
					_this.$dispatch("ev_dtUpdate");
					LIB.Msg.info("已失效!");
					_this.mainModel.vo.status = 2;
				});
			},
			doShowDominationAreaSelectModal : function() {
				this.selectModel.dominationAreaSelectModel.visible = true;
				//this.selectModel.dominationAreaSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveDominationArea : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.dominationArea = selectedDatas[0];
					this.mainModel.vo.dominationAreaId = selectedDatas[0].id;
					// if(!this.mainModel.vo.specificAddress) {
					// 	this.mainModel.vo.specificAddress = selectedDatas[0].name;
					// }
				}
			},
			doShowUserSelectModal : function() {
				this.selectModel.userSelectModel.visible = true;
				//this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveUsers : function(selectedDatas) {
				if (selectedDatas) {
					dataModel.mainModel.vo.users = selectedDatas;
					var param = _.map(selectedDatas, function(data){return {id : data.id}});
					var _this = this;

					_.each(selectedDatas, function (item) {
						var obj = _.find(_this.mainModel.vo.usersList, function (voItem) {
							return voItem.id == item.id;
                        });
						if(!obj) _this.mainModel.vo.usersList.push(item)
                    })

					// this.mainModel.vo.usersList = selectedDatas;
					// api.saveUsers({id : this.mainModel.id}, param).then(function() {
					// 	_this.queryUsers(_this.mainModel.id);
					// });
				}
			},
			afterDoSave:function () {
				var _this = this;
				if(this.mainModel.vo.usersList.length == 0) return;
				setTimeout(function () {
                    var param = _.map(_this.mainModel.vo.usersList, function(data){return {id : data.id}});
                    api.saveUsers({id : _this.mainModel.id}, param).then(function() {
                        _this.queryUsers(_this.mainModel.id);
                    });
                },500);
            },

			afterInitData : function() {
				// this.$refs.userTable.doQuery({id : this.mainModel.vo.id});
				this.mainModel.id = this.mainModel.vo.id;
                this.mainModel.subjectType = this.mainModel.vo.subjectType.split(",")
				this.queryUsers(this.mainModel.vo.id);
			},

			afterDoCancel:function () {
				if(this.mainModel.vo.subjectType)
                	this.mainModel.subjectType = this.mainModel.vo.subjectType.split(",");
				else
                    this.mainModel.subjectType = [];
            },

            queryUsers:function (id) {
				var _this = this;
				var obj = {
                    "criteria.orderValue.fieldName":"modifyDate",
					"criteria.orderValue.orderType":1,
					disable:0,
                    pageNo:1,pageSize:1000,
					id:	id
				};

                api.queryUsers(obj).then(function (res) {
                    // _.each(res.data.list,function (item) {
                    //     item.value = item.name;
                    // })
					_this.mainModel.vo.usersList = res.data.list;
                })
            },
			getUUId:function () {
				var _this = this;
				api.getUUID().then(function (res) {
					_this.mainModel.id = res.data;
                });
            },

			beforeInit : function(vo, obj) {
                this.mainModel.vo.usersList = [];
                this.mainModel.subjectType = [];
				this.mainModel.opType = obj.opType;
				var _this = this;
				// this.$refs.userTable.doClearData();

				var curYear = new Date().getFullYear();
				var minYear = curYear;
				var maxYear = curYear + 50;
				var yearList = [];
				for(var y = minYear; y <= maxYear; y ++) {
					yearList.push({id:y + "", name: y});
				}
				_this.yearList = yearList.concat();
                if(obj.opType == 'create'){
                    this.getUUId();
                }
			},
            beforeDoSave:function () {
                if(this.mainModel.opType == 'create'){
                    this.mainModel.vo.id = this.mainModel.id;
                }
            },
			doDelete: function() {

				//当beforeDoDelete方法明确返回false时,不继续执行doDelete方法, 返回undefine和true都会执行后续方法
				if (this.beforeDoDelete() === false) {
					return;
				}

				var _vo = this.mainModel.vo;
				var _this = this;
				var title = '删除当前数据?';
				if(_vo.status === "1"){
					title = "删除已发布的“演练计划”会删除该计划对应的“演练方案”及方案相关的所有数据，" + title;
				}
				LIB.Modal.confirm({
					title: title,
					onOk: function() {
						_this.$api.remove(null, _vo).then(function() {
							_this.afterDoDelete(_vo);
							_this.$dispatch("ev_dtDelete");
							LIB.Msg.info("删除成功");
						});
					}
				});
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