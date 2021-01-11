define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	var BASE = require("base");

	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	// var checkPlanSelectModal = require("componentsEx/selectTableModal/checkPlanSelectModal");
    var checkPlanSelectModal = require("./dialog/checkPlanSelectModal");

    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var workPlanDelegateComponent = require("./dialog/workPlanDelegate");

    var rebuildOrgName = function(id, type, name) {

        var spliteChar = " / ";

        var curOrgName = name || '';

        //if(type == 'comp') {
        //	return LIB.getDataDic("org", id)["compName"];
        //} else if(type == 'dept') {
        //	return LIB.getDataDic("org", id)["deptName"];
        //}

        //var orgFieldName = type == "comp" ? "compName" :"deptName";
        //使用公司简称csn(company short name)代替compName
        var orgFieldName = type == "comp" ? "csn" : "deptName";

        if (BASE.setting.orgMap[id]) {

            if (curOrgName != '') {
                var orgName = LIB.getDataDic("org", id)[orgFieldName]

                //如果渲染的组织结构是部门, 通过DataDic获取的值为undefine，则表示父级是公司了，则当前是顶级部门, 直接返回即可
                if (orgName != undefined) {
                    curOrgName = orgName + spliteChar + curOrgName;
                } else {
                    return curOrgName;
                }
            } else {
                curOrgName = LIB.getDataDic("org", id)[orgFieldName];
            }

            var parentId = BASE.setting.orgMap[id]["parentId"];

            //不存在父级组织机构了,则表示是顶级组织机构
            if (!!parentId) {

                //部门的 id==parentId 时表示是顶级部门
                if (id == parentId) {
                    return curOrgName;
                }
                curOrgName = rebuildOrgName(parentId, type, curOrgName);
            }
        }
        return curOrgName;
    };
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编码
			code : null,
			//计划名
			name : null,
			createBy:null,
			attr1:null,
			//开始时间
			startDate : null,
			//禁用标识 0未发布，1发布
			disable : "0",
			//结束时间
			endDate : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//备注
			remarks : null,
			//计划发布人
			user : {id:'', name:''},
			//受检人
			checkedUser : {id:'', name:''},
			//工作计划类型 0:一般工作计划,1:与检查计划相关联的工作计划
			type : 1,
			//null
			checkPlans : [],
			createUserId:null,
			checkedOrgId:null,
			checkedUserId:null,
			type:1,
		}
	};
	//Vue数据
	var dataModel = {
		isCreater : false,
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			
			//验证规则
	        rules:{
				"code" : [LIB.formRuleMgr.length(100)],
				"name" : [LIB.formRuleMgr.require("计划名"),
						  LIB.formRuleMgr.length(50)
				],
				"startDate" : [LIB.formRuleMgr.require("开始时间")],
				"disable" :LIB.formRuleMgr.require("状态"),
				"endDate" : [LIB.formRuleMgr.require("结束时间")],
				"compId" : [LIB.formRuleMgr.require("监督机构")],
				"orgId" : [LIB.formRuleMgr.require("监督部门")],
				"remarks" : [LIB.formRuleMgr.length(500)],
				"checkedOrgId" : [LIB.formRuleMgr.require("被检单位")],
				"user.id" : [LIB.formRuleMgr.require("计划发布人")],
				"checkedUser.id" : [LIB.formRuleMgr.require("被检单位负责人")],
	        }
		},
		tableModel : {
			checkPlanTableModel : LIB.Opts.extendDetailTableOpt({
				url : "workplan/checkplans/list/{curPage}/{pageSize}",
				columns : [
					{
						title : "检查计划名称",
						fieldName : "name",
						// keywordFilterName: "criteria.strValue.keyWordValue_name"
					},
					{
						title: "状态",
						fieldType: "custom",
						render: function(data) {
							if(data.endDate != null && data.disable != null && data.disable == 1 && data.endDate < new Date().Format("yyyy-MM-dd hh:mm:ss")) {
								data.disable = 3;
							}
							return LIB.getDataDic("isPublished", data.disable);
						},
						// keywordFilterName: "criteria.strValue.keyWordValue_disable",
					},
					{
						title : "开始时间",
						fieldName : "startDate",
						// keywordFilterName: "criteria.strValue.keyWordValue_startDate"
					},
					{
						title : "结束时间",
						fieldName : "endDate",
						// keywordFilterName: "criteria.strValue.keyWordValue_endDate"
					},
					{
                        title: "所属公司",
                        fieldType: "custom",
                        render: function(data) {
                            if (data.compId) {
                                return rebuildOrgName(data.compId, 'comp');
                            }
                        },
                        width: 160
					},
					{
                        title: "所属部门",
                        fieldType: "custom",
                        render: function(data) {
                            if (data.orgId) {
                                return rebuildOrgName(data.orgId, 'dept');
                            }
                        },
                        width: 160
					},
					{
						title: "创建人",
						fieldName: "creator.name",
						// filterType: "text",
					},
					{
						title : "",
						fieldType : "tool",
						toolType : "del"
					}
				]
			}),
			operateRecordTableModel : LIB.Opts.extendDetailTableOpt({
				url : "workplan/operateRecords/list/{curPage}/{pageSize}",
				columns : [
					{
						title : "操作记录",
						fieldName : "operateName",
						keywordFilterName: "criteria.strValue.keyWordValue_operateName"
					},
					{
						title: "操作人",
						fieldName : "userName",
						keywordFilterName: "criteria.strValue.keyWordValue_userName",
					},
					{
						title : "操作时间",
						fieldName : "createDate",
						keywordFilterName: "criteria.strValue.keyWordValue_createDate"
					},
				]
			}),
		},
		formModel : {
		},
		cardModel : {
			checkPlanCardModel : {
				showContent : true
			},
			operateRecordCardModel:{
				showContent : true
			}
		},
		selectModel : {
			userSelectModel : {
				visible : false,
				filterData : {orgId : null},
				type:null,//0:计划发布人，1被检单位负责人
			},
			checkPlanSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},
		delegateModel: {
			title: "委托",
			//显示编辑弹框
			show: false,
			workPlanId: null
		},
		showUserSelectModal:false,
		isCreater :false,

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
			"checkplanSelectModal":checkPlanSelectModal,
			"userSelectModal":userSelectModal,
			"work-plan-delegate-component": workPlanDelegateComponent,
			
        },
		data:function(){
			return dataModel;
		},
		computed: {
			showPanelMask: function () {
				return this.mainModel.opType === 'create'
						|| (this.mainModel.opType === 'update' && this.mainModel.action === 'copy')
						|| this.mainModel.vo.disable === '0'
						|| (this.mainModel.vo.attr1 == null && LIB.user.id != this.mainModel.vo.checkedUserId)
					    || (this.mainModel.vo.attr1 && LIB.user.id != this.mainModel.vo.attr1);
			},
		},
		methods:{
			newVO : newVO,
			doShowUserSelectModal : function() {
				this.selectModel.userSelectModel.visible = true;
				this.selectModel.userSelectModel.type = 0;
				//this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doShowcheckedUserSelectModal : function() {
				this.selectModel.userSelectModel.visible = true;
				this.selectModel.userSelectModel.type = 1;
				//this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.checkedOrgId};
			},
			doSaveUser : function(selectedDatas) {
				if (selectedDatas) {
					if(this.selectModel.userSelectModel.type === 0){
						this.mainModel.vo.user = selectedDatas[0];
						this.mainModel.vo.createUserId = selectedDatas[0].id;
					}else if(this.selectModel.userSelectModel.type === 1){
						this.mainModel.vo.checkedUser = selectedDatas[0];
						this.mainModel.vo.checkedUserId = selectedDatas[0].id;
					}

				}
			},
			doShowCheckPlanSelectModal : function() {
				// if(LIB.user.id == this.mainModel.vo.createUserId && this.mainModel.vo.disable === '1'){
				// 	this.selectModel.checkPlanSelectModel.visible = true;
				// }
				this.selectModel.checkPlanSelectModel.visible = true;
				//this.selectModel.checkPlanSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveCheckPlans : function(selectedDatas) {
				if (selectedDatas) {
					dataModel.mainModel.vo.checkPlans = selectedDatas;
					var param = _.map(selectedDatas, function(data){return {id : data.id}});
					var _this = this;
					api.saveCheckPlans({id : dataModel.mainModel.vo.id}, param).then(function() {
						_this.refreshTableData(_this.$refs.checkplanTable);
						_this.refreshTableData(_this.$refs.operaterecordTable);
					});
				}
			},
			doRemoveCheckPlan : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeCheckPlans({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.checkplanTable.doRefresh();
							_this.$refs.operaterecordTable.doRefresh();
						});
					}
				});
			},
			afterInitData : function() {
				LIB.globalLoader.hide();
				this.$refs.checkplanTable.doQuery({id : this.mainModel.vo.id});
				this.$refs.operaterecordTable.doQuery({id : this.mainModel.vo.id});
				this.isCreater  = this.mainModel.vo.createUserId == LIB.user.id || this.mainModel.vo.createBy == LIB.user.id;
			},
			beforeInit : function() {
				this.$refs.checkplanTable.doClearData();
				this.$refs.operaterecordTable.doClearData();
				LIB.globalLoader.hide();
			},
			afterInit: function () {
				if (this.mainModel.opType === 'create') {
					this.mainModel.vo.user = {
						id: LIB.user.id,
						name: LIB.user.name
					};
					this.mainModel.vo.createUserId = LIB.user.id;
					this.mainModel.vo.orgId = LIB.user.orgId;
				}
				
			},
			afterDoSave: function() {
				this.$refs.operaterecordTable.doQuery({id : this.mainModel.vo.id});
				this.isCreater  = this.mainModel.vo.createUserId == LIB.user.id || this.mainModel.vo.createBy == LIB.user.id;
			},
			doEnableDisable: function() {
				var _this = this;
				var data = _this.mainModel.vo;
				var params = {
					id: data.id,
					orgId: data.orgId,
					disable: data.disable === "0" ? "1" : "0"
				};
				if(this.$api.updateDisable) {
					this.$api.updateDisable(null,  params).then(function (res) {
						data.disable = (data.disable === "0") ? "1" : "0";
						LIB.Msg.info((data.disable === "0") ? "取消发布成功" : "发布成功");
						_this.$dispatch("ev_dtUpdate");
						_this.$refs.operaterecordTable.doRefresh();
					});
				} else {
					this.$api.update(null,  params).then(function (res) {
						data.disable = (data.disable === "0") ? "1" : "0";
						LIB.Msg.info((data.disable === "0") ? "取消发布成功" : "发布成功");
						_this.$dispatch("ev_dtUpdate");
						_this.$refs.operaterecordTable.doRefresh();
					});
				}
			},
			doAddCheckPlan :function() {
				var router = LIB.ctxPath("/html/main.html#!");
				var routerPart = "/hiddenDanger/businessCenter/inspectionPlan?method=doAdd";
				window.open(router + routerPart);
			},
			doDelegate: function () {
				if(this.mainModel.vo.disable != 1){
					LIB.Msg.warning("只能委托已发布的工作计划");
					return;
				}
				if(this.mainModel.vo.attr1 && this.mainModel.vo.attr1 != LIB.user.id){
					LIB.Msg.warning("只能委托自己的工作计划");
					return;
				}else if(!this.mainModel.vo.attr1 && this.mainModel.vo.checkedUserId && this.mainModel.vo.checkedUserId != LIB.user.id){
					LIB.Msg.warning("只能委托自己的工作计划");
					return;
				}
				this.delegateModel.workPlanId = this.mainModel.vo.id;
				this.delegateModel.show = true;
			},

		},
		events: {
			"ev_delegate": function (id) {
				//重新加载数据
				this.$dispatch("ev_dtUpdate");
				this.mainModel.vo.attr1 = id;
				this.delegateModel.show = false;
			},
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});