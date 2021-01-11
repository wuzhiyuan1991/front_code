define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");
	var emerSceneFormModal = require("componentsEx/formModal/emerSceneFormModal");
	var emerContactFormModal = require("componentsEx/formModal/emerContactFormModal");
	var emerStepFormModal = require("componentsEx/formModal/emerStepFormModal");
	var emerDutyFormModal = require("componentsEx/formModal/emerDutyFormModal");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");


    //初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编码
			code : null,
			//处置卡名称
			name : null,
			//注意事项
			announcements : null,
			//禁用标识 0:启用,1:禁用
			disable : "1",
			//所属公司id
			compId : null,
			//所属部门id
			orgId : null,
			//属地
			dominationArea : {id:'', name:''},
			//事故风险分析
			emerScenes : [],
			//紧急联系人
			emerContacts : [],
			//处置步骤
			emerSteps : [],
			//工作职责
			emerDuties : [],
            contact:null
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			isSimpleModal:false,  // 是否为简易模式
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			
			//验证规则
	        rules:{
				"code" : [LIB.formRuleMgr.length(100)],
				"name" : [LIB.formRuleMgr.require("处置卡名称"),
						  LIB.formRuleMgr.length(100)
				],
				"announcements" : [LIB.formRuleMgr.require("注意事项"),
						  LIB.formRuleMgr.length(5000)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"orgId" : [LIB.formRuleMgr.require("所属部门"),
						  LIB.formRuleMgr.length(10)
				],
				// "dominationArea.id" : [LIB.formRuleMgr.require("属地")],
                "dominationArea.id": [],
                "dominationAreaId":[LIB.formRuleMgr.allowStrEmpty],
				"contact": LIB.formRuleMgr.length(2000)
            }
		},
		tableModel : {
			emerSceneTableModel : LIB.Opts.extendDetailTableOpt({
				url : "emercard/emerscenes/list/{curPage}/{pageSize}",
				list:[],
				columns : [
                    {
                        title: "事故类型",
                        fieldName: "accidentType",
                        width: "150px"
                    },
                    {
                        title: "事故发生的区域、地点或装置的名称",
                        width: "200px",
                        fieldName: "accidentScene"
                    },
                    {
                        title: "事故发生的可能时间，事故的危害严重程度及其影响范围",
                        width: "225px",
                        fieldName: "timeAndInfluence"
                    },

                    {
                        title: "事故前可能出现的征兆",
                        width: "200px",
                        fieldName: "sign"
                    },
                    {
                        title: "事故可能引发的次生、衍生事故",
                        width: "225px",
                        fieldName: "derivativeEvents"
                    },
				]
			}),
			emerStepTableModel : LIB.Opts.extendDetailTableOpt({
				url : "emercard/emersteps/list/{curPage}/{pageSize}",
				list:[],
				columns : [
					{
						title : "步骤",
						fieldName : "name",
						width:"200px"
					},
					{
						title : "处置",
						fieldName : "disposal",
					},
					{
						title : "负责人",
						fieldName : "principal",
                        width:"200px"
					},
                    {
                        title : "相关岗位",
                        fieldName : "principal",
                        width:"200px",
						render:function (data) {
							var str = '';
							_.each(data.positions, function (item) {
								str += item.name + " ，";
                            });
							if(str){
								str = str.substring(0, str.length -1);
							}
							return str;
                        }
                    },

				]
			}),
			emerDutyTableModel : LIB.Opts.extendDetailTableOpt({
				url : "emercard/emerduties/list/{curPage}/{pageSize}",
				list:[],
				columns : [
					{
						title : "岗位",
						fieldName : "position",
						width:"250px"
					},
					{
						title : "职责",
						fieldName : "duty",

					}
				]
			}),
            emerContactTableModel1 : LIB.Opts.extendDetailTableOpt({
                url : "emercard/emercontacts/list/{curPage}/{pageSize}",
                defaultFilterValue : {"criteria.intsValue.isInsider":["1"]},  //  1:内部人员,0:外部人员
                columns : [
                    {
                        title : "姓名",
                        fieldName : "name",
                        render:function (data) {
                            if(data.user){
                                return data.user.name;
                            }
                        }
                    },
                    {
                        title : "联系方式",
                        fieldName : "name",
                        render:function (data) {
                            if(data.user){
                                return data.user.mobile;
                            }
                        }
                    },
                    {
                        title : "岗位",
                        fieldName : "name",
                        render: function (data) {
                            if (data.user && data.user.positionList) {
                                var posNames = "";
                                data.user.positionList.forEach(function (e) {
                                    if (e.postType == 0 && e.name) {
                                        posNames += (e.name + ",");
                                    }
                                });
                                posNames = posNames.substr(0, posNames.length - 1);
                                return posNames;
                            }
                        },
                    },
                    {
                        title : "部门",
                        fieldName : "name",
                        render:function (data) {
                            if(data.user && data.user.org && data.user.org.name){
                                return data.user.org.name;
                            }
                        },
                    },
                    {
                        title: "公司",
                        fieldName: "data.user.orgId",
                        render:function (data) {
                            if(data.user  && data.user.orgId){
                                return  LIB.getDataDic('org', data.user.orgId).compName
                            }
                            // return  LIB.getDataDic('org', data.orgId).compName
                        }
                    },
                    {
                        title : "",
                        fieldType : "tool",
                        toolType : "del"
                    }]
            }),
            emerContactTableModel2 : LIB.Opts.extendDetailTableOpt({
                url : "emercard/emercontacts/list/{curPage}/{pageSize}",
                defaultFilterValue : {"criteria.intsValue.isInsider":["1"]},  //  1:内部人员,0:外部人员
                columns : [
                    {
                        title : "姓名",
                        fieldName : "name",
                    },
                    {
                        title : "联系方式",
                        fieldName : "mobile",
                    },
                    {
                        title : "职务",
                        fieldName : "position",
                    },
                    {
                        title : "机构",
                        fieldName : "organization",
                    },
                    {
                        title : "",
                        fieldType : "tool",
                        toolType : "del,edit"
                    }]
            }),
        },
		formModel : {
			emerSceneFormModel : {
				show : false,
				hiddenFields : ["emerCardId"],
				queryUrl : "emercard/{id}/emerscene/{emerSceneId}"
			},
			emerContactFormModel : {
				show : false,
				hiddenFields : ["emerCardId"],
				queryUrl : "emercard/{id}/emercontact/{emerContactId}"
			},
			emerStepFormModel : {
				show : false,
				hiddenFields : ["emerCardId"],
				queryUrl : "emercard/{id}/emerstep/{emerStepId}"
			},
			emerDutyFormModel : {
				show : false,
				hiddenFields : ["emerCardId"],
				queryUrl : "emercard/{id}/emerduty/{emerDutyId}"
			},
		},
		cardModel : {
			emerSceneCardModel : {
				showContent : true
			},
			emerContactCardModel : {
				showContent : true
			},
			emerStepCardModel : {
				showContent : true
			},
			emerDutyCardModel : {
				showContent : true
			},
		},
		selectModel : {
			dominationAreaSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
            userSelectModel: {
                visible : false,
                filterData : {orgId : null}
			}
		},
        userTypeIndex:0, // 当前选择人员类型
        userType:[{name:"内部", id:'1'}, {name:"外部", id:"0"}],
		stepIndex:0,
		stepList:[],
        isUpdateInfo:0,  // 注意事项按钮
		updateRules:{
            "announcements" : [
                LIB.formRuleMgr.length(65535)
            ],
		}

//无需附件上传请删除此段代码
/*
		fileModel:{
			file : {
				cfg: {
					params: {
						recordId: null,
						dataType: 'XXX1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					},
					filters: {
						max_file_size: '10mb',
					},
				},
				data : []
			},
			pic : {
				cfg: {
					params: {
						recordId: null,
						dataType: 'XXX2', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					},
					filters: {
						max_file_size: '10mb',
						mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
					}
				},
				data : []
			},
			video : {
				cfg: {
					params: {
						recordId: null,
						dataType: 'XXX3', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					},
					filters: {
						max_file_size: '10mb',
						mime_types: [{title: "files", extensions: "mp4,avi,flv,3gp"}]
					}
				},
				data : []
			}
		}
*/


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
			"emersceneFormModal":emerSceneFormModal,
			"emercontactFormModal":emerContactFormModal,
			"emerstepFormModal":emerStepFormModal,
			"emerdutyFormModal":emerDutyFormModal,
			"userSelectModal":userSelectModal
        },
		computed:{
            sceneTableTools:function () {
                return ["update", "del"]
                // if(this.mainModel.vo.disable != '0'){
                 //    return ["update", "del"]
				// }else{
                 //    return []
				// }
            }
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,

            beforeDoSave:function () {
				if(!this.mainModel.vo.orgId || this.mainModel.vo.orgId == '' || this.mainModel.vo.orgId == null){
                    this.mainModel.vo.orgId = this.mainModel.vo.compId;
                    this.mainModel.vo.dominationAreaId = null;
				}
            },

            doEnableDisableFilter:function () {
				// if(this.mainModel.vo.disable == '1' && !this.mainModel.vo.announcements){
				// 	LIB.Msg.error("请填写注意事项");
				// 	return ;
				// }
                this.doEnableDisable();
            },

			// 大文本编辑框
            doUpdateInfo:function (val) {
				this.isUpdateInfo = val;
            },
			// 大文本编辑框
			doSaveInfo:function () {
				var _this = this;
                this.$refs.ruleform1.validate(function(valid) {
                	if(valid){
                        api.updateAnnouncements(_this.mainModel.vo).then(function (item) {
                            _this.isUpdateInfo = 0;
                            LIB.Msg.info("保存成功");
                        });
                    }
				})

            },

			doShowDominationAreaSelectModal : function() {
				this.selectModel.dominationAreaSelectModel.visible = true;
				//this.selectModel.dominationAreaSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveDominationArea : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.dominationArea = selectedDatas[0];
				}
			},
			doShowEmerSceneFormModal4Update : function(param) {
				this.formModel.emerSceneFormModel.show = true;
				this.$refs.emersceneFormModal.init("update", {id: this.mainModel.vo.id, emerSceneId: param.id});
			},
			doShowEmerSceneFormModal4Create : function(param) {
				this.formModel.emerSceneFormModel.show = true;
				this.$refs.emersceneFormModal.init("create");
			},
			doSaveEmerScene : function(data) {
				if (data) {
					var _this = this;
					api.saveEmerScene({id : this.mainModel.vo.id}, data).then(function() {
						// _this.refreshTableData(_this.$refs.emersceneTable);
						LIB.Msg.info("保存成功")
                        _this.queryEmerScenes();
					});
				}
			},
			doUpdateEmerScene : function(data) {
				if (data) {
					var _this = this;
					api.updateEmerScene({id : this.mainModel.vo.id}, data).then(function() {
						// _this.refreshTableData(_this.$refs.emersceneTable);
                        LIB.Msg.info("保存成功")
                        _this.queryEmerScenes();
					});
				}
			},
			doRemoveEmerScene : function(item) {
				var _this = this;
				var data = item;
				LIB.Modal.confirm({
					title: '删除数据,会影响应急步骤相关的内容',
					onOk: function () {
						api.removeEmerScenes({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							// _this.$refs.emersceneTable.doRefresh();
                            LIB.Msg.info("删除成功")
                            _this.queryEmerScenes();
						});
					}
				});
			},
			doShowEmerContactFormModal4Update : function(param) {
				this.formModel.emerContactFormModel.show = true;
				this.$refs.emercontactFormModal.init("update", {id: this.mainModel.vo.id, emerContactId: param.entry.data.id});
			},
			doShowEmerContactFormModal4Create : function(param) {
				// this.formModel.emerContactFormModel.show = true;
                // this.$refs.emercontactFormModal.init("create");
                if(this.userTypeIndex == 0){
                    this.selectModel.userSelectModel.filterData = {compId:this.mainModel.vo.compId};
                    this.selectModel.userSelectModel.visible = true;

                    return ;
                }
                this.formModel.emerContactFormModel.show = true;
                this.$refs.emercontactFormModal.init("create");
			},
            doSaveUserInner:function (data) {
				var _this = this;
                var param = [];

                for(var i=0; i<data.length; i++){
                    var obj = {
                        isInsider : '1',
                        user:{id:data[i].id, name:data[i].name}
                    };
                    param.push(obj);
                }
                api.saveEmerContacts({id : this.mainModel.vo.id}, param).then(function() {
                    // _this.refreshTableData(_this.$refs.emercontactTable);
                    LIB.Msg.info("保存成功")
                    if(_this.userTypeIndex == '0'){
                        _this.refreshTableData(_this.$refs.emercontactTable1);
                    }else{
                        _this.refreshTableData(_this.$refs.emercontactTable2);
                    }
                });

            },
			doSaveEmerContact : function(data) {
				if (data) {
					var _this = this;
					api.saveEmerContact({id : this.mainModel.vo.id}, data).then(function() {
						// _this.refreshTableData(_this.$refs.emercontactTable);
                        LIB.Msg.info("保存成功")
                        if(_this.userTypeIndex == '0'){
                            _this.refreshTableData(_this.$refs.emercontactTable1);
                        }else{
                            _this.refreshTableData(_this.$refs.emercontactTable2);
                        }
					});
				}
			},
			doUpdateEmerContact : function(data) {
				if (data) {
					var _this = this;
					data.isInitial = this.userType[this.userTypeIndex].id;
					api.updateEmerContact({id : this.mainModel.vo.id}, data).then(function() {
                        LIB.Msg.info("保存成功")
						if(_this.userTypeIndex == '0'){
                            _this.refreshTableData(_this.$refs.emercontactTable1);
						}else{
                            _this.refreshTableData(_this.$refs.emercontactTable2);
						}

					});
				}
			},
			doRemoveEmerContact : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeEmerContacts({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							// _this.$refs.emercontactTable.doRefresh();
                            LIB.Msg.info("删除成功")
							if(_this.userTypeIndex == '0'){
                                _this.refreshTableData(_this.$refs.emercontactTable1);
                            }else{
                                _this.refreshTableData(_this.$refs.emercontactTable2);
                            }
						});
					}
				});
			},
			doShowEmerStepFormModal4Update : function(param) {
				this.formModel.emerStepFormModel.show = true;
				this.$refs.emerstepFormModal.init("update", {id: this.mainModel.vo.id, emerStepId: param.id});
			},
			doShowEmerStepFormModal4Create : function(param) {
				this.formModel.emerStepFormModel.show = true;
				this.$refs.emerstepFormModal.init("create");
			},
			doSaveEmerStep : function(data) {
				if (data) {
					var _this = this;
					if(this.mainModel.isSimpleModal){
                        data.emerScene = {id:9999999999}
					}else{
                        data.emerScene = this.tableModel.emerSceneTableModel.list[this.stepIndex];
                    }
					api.saveEmerStep({id : this.mainModel.vo.id}, data).then(function() {
						// _this.refreshTableData(_this.$refs.emerstepTable);
						LIB.Msg.info("保存成功");
                        _this.queryEmerSteps();
					});
				}
			},
			doUpdateEmerStep : function(data) {
				if (data) {
					var _this = this;
                    if(this.mainModel.isSimpleModal){
                        data.emerScene = {id:9999999999}
                    }else{
                        data.emerScene = {id:this.tableModel.emerSceneTableModel.list[this.stepIndex].id};
                    }
					api.updateEmerStep({id : this.mainModel.vo.id}, data).then(function() {
						// _this.refreshTableData(_this.$refs.emerstepTable);
						LIB.Msg.info("保存成功");
                        _this.queryEmerSteps();
					});
				}
			},
			doRemoveEmerStep : function(item) {
				var _this = this;
				var data = item;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeEmerSteps({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							// _this.$refs.emerstepTable.doRefresh();
							LIB.Msg.info("删除成功")
							_this.queryEmerSteps();
						});
					}
				});
			},
			doShowEmerDutyFormModal4Update : function(param) {
				this.formModel.emerDutyFormModel.show = true;
				this.$refs.emerdutyFormModal.init("update", {id: this.mainModel.vo.id, emerDutyId: param.id});
			},
			doShowEmerDutyFormModal4Create : function(param) {
				this.formModel.emerDutyFormModel.show = true;
				this.$refs.emerdutyFormModal.init("create");
			},
			doSaveEmerDuty : function(data) {
				if (data) {
					var _this = this;
					api.saveEmerDuty({id : this.mainModel.vo.id}, data).then(function() {
						// _this.refreshTableData(_this.$refs.emerdutyTable);
						LIB.Msg.info("保存成功");
                        _this.queryEmerDuties();
					});
				}
			},
			doUpdateEmerDuty : function(data) {
				if (data) {
					var _this = this;
					api.updateEmerDuty({id : this.mainModel.vo.id}, data).then(function() {
						// _this.refreshTableData(_this.$refs.emerdutyTable);
						LIB.Msg.info("保存成功");
                        _this.queryEmerDuties();
					});
				}
			},
			doRemoveEmerDuty : function(item) {
				var _this = this;
				var data = item;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeEmerDuties({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							LIB.Msg.info("删除成功");
                            _this.queryEmerDuties();
						});
					}
				});
			},
			afterInitData : function() {
				// this.$refs.emersceneTable.doQuery({id : this.mainModel.vo.id});
				this.queryEmerScenes();
                this.queryEmerDuties();

				this.$refs.emercontactTable1.doQuery({id : this.mainModel.vo.id});
                this.$refs.emercontactTable2.doQuery({id : this.mainModel.vo.id});
				// this.$refs.emerstepTable.doQuery({id : this.mainModel.vo.id});
				// this.$refs.emerdutyTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.emercontactTable1.doClearData();
                this.$refs.emercontactTable2.doClearData();
                this.tableModel.emerSceneTableModel.list = [];
                this.tableModel.emerDutyTableModel.list = [];
                this.tableModel.emerStepTableModel.list = [];

                this.stepList = [];
                this.stepIndex = 0;
                this.userTypeIndex = 0;

                this.mainModel.vo = new newVO();
			},
            queryEmerScenes:function () {
				var _this =  this;
				api.queryEmerScenes({id:this.mainModel.vo.id}).then(function (res) {
                    _this.tableModel.emerSceneTableModel.list = res.data.list;
                    _this.queryEmerSteps();
                });
            },
            // emerDutyTableModel
            queryEmerDuties:function () {
				var _this = this;
                api.queryEmerDuties({id:this.mainModel.vo.id}).then(function (res) {
                    _this.tableModel.emerDutyTableModel.list = res.data.list;
                });
            },
            // queryEmerSteps
            queryEmerSteps:function () {
				var _this = this;
				api.queryEmerSteps({id:this.mainModel.vo.id}).then(function (res) {
					_this.tableModel.emerStepTableModel.list = res.data;
					if(_this.stepIndex == _this.tableModel.emerSceneTableModel.list.length){
						_this.stepIndex = _this.tableModel.emerSceneTableModel.list.length-1;
					}
					_this.doChangeStep(_this.stepIndex);
                })
            },

            doChangeStep:function (val) {
				var _this = this;
				this.stepIndex = val;

				if(this.mainModel.isSimpleModal){
                    this.stepList = _.filter(this.tableModel.emerStepTableModel.list, function (item) {
                        if(item.emerSceneId == "9999999999"){
                            return true;
                        }
                    })
					return ;
				}

				this.stepList = _.filter(this.tableModel.emerStepTableModel.list, function (item) {
					if(item.emerSceneId == _this.tableModel.emerSceneTableModel.list[_this.stepIndex].id){
						return true;
					}
                })
            },

            doChangeUserType:function (index) {
                this.userTypeIndex = index;
                var params = [
                    {
                        value : {
                            columnFilterName : "criteria.intsValue.isInsider", // 1内部 0外部
                            columnFilterValue :  [this.userType[this.userTypeIndex].id + ''],
                        },
                        type : "save"
                    },
                    {
                        value : {
                            columnFilterName : "id",
                            columnFilterValue :  this.mainModel.vo.id,
                        },
                        type : "save"
                    },
                ];
                if(this.userTypeIndex == 0){
                    this.$refs.emercontactTable1.doQueryByFilter(params); // 内部
                }else{
                    this.$refs.emercontactTable2.doQueryByFilter(params); // 内部
                    // this.$refs.exerciseparticipantTable2.doQueryByFilter(params); // 外部
                }
            },  // doShowExerciseParticipantFormModal4Create
		},
		events : {
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});