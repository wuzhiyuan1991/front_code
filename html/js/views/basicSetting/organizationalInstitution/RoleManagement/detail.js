define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var otherOrganUserSelectModal = require("componentsEx/selectTableModal/otherOrganUserSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			//角色ID
			id : null,
			//角色编码
			code : null,
			//角色名称
			name : null,
			//是否禁用，0启用，1禁用
			disable : null,
			//备注
			remarks : null,
			//0：普通角色 1：hse角色
			roleType : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//人员
			users : [],
			otherOrganUsers: [],
			roleId: null,
			userList:null,
			otherOrganUserList:null,
			compId:null,
			orgId:null,
            attr1:"1"
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			//showUserSelectModal : false,
			
			//验证规则
			rules:{
				// code : [LIB.formRuleMgr.require("权限编码"),
				// 	LIB.formRuleMgr.length()
				// ],
				name: [
					{required: true, message: '请输入权限名称'},
				]
			},
			copyId:null,
	        emptyRules:{}
		},
		tableModel : {
			userTableModel : {
				url : "role/users/list/{curPage}/{pageSize}",
				columns : [{
					title : "编码",
                    fieldType: "custom",
                    pathCode: LIB.ModuleCode.BS_OrI_PerM,
                    render: function(data) {
                        if (data.code) {
                            return data.code;
                        }
                    },
                    keywordFilterName: "criteria.strValue.keyWordValue_code"
				},{
					title : "姓名",
					fieldName : "name",
                    keywordFilterName: "criteria.strValue.keyWordValue_name"
				},{
					title : "",
					fieldType : "tool",
					toolType : "del"
				}]
			},
			otherOrganUserTableModel : {
				url : "role/users/otherOrgan/list/{curPage}/{pageSize}",
				columns : [{
					title : "姓名",
					fieldName : "name",
                    keywordFilterName: "criteria.strValue.keyWordValue_name"
				},{
					title : "所属公司",
					fieldType : "custom",
					render: function(data){
						if(data.compId){
							return LIB.getDataDic("org", data.compId)["compName"];
						}
					}
				},{
					title : "所属部门",
					fieldType : "custom",
					render: function(data){
						if(data.orgId){
							return LIB.getDataDic("org", data.orgId)["deptName"];
						}
					}
				},{
					title : "",
					fieldType : "tool",
					toolType : "del"
				}]
			}
		},
		formModel : {
		},
		selectModel:{
			userSelectModel:{
				visible:false,
                filterData: {
                    compId: null,
                    type: 0
                }
			},
			otherOrganUserSelectModel:{
				visible:false,
                filterData: {
                    compId: null,
                    orgId: null,
					type: 0
                }
			}
		},
        copyModel: {
            visible: false,
            title: "复制",
            isNeedCopyUser: false
        }
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
			"userSelectModal":userSelectModal,
			"otherOrganUserSelectModal":otherOrganUserSelectModal
        },
		data:function(){
			return dataModel;
		},
		computed: {
			disableLable: function () {
				return this.mainModel.vo.disable == '1' ? '停用' : '启用';
			},
		},
		methods:{
			newVO : newVO,
			doShowUserSelectModel:function(){
				this.selectModel.userSelectModel.visible = true;
                this.selectModel.userSelectModel.filterData ={compId : this.mainModel.vo.compId, type:0};
			},
			doShowOtherOrganUserSelectModel:function(){
				this.selectModel.otherOrganUserSelectModel.visible = true;
			},
			doSaveUsers : function(selectedDatas) {
				if (selectedDatas) {
					dataModel.mainModel.vo.users = selectedDatas;
					var param = _.map(selectedDatas, function(data){return {id : data.id}});
					var _this = this;
					api.saveUsers({id : dataModel.mainModel.vo.id}, param).then(function() {
						_this.refreshTableData(_this.$refs.userTable);
					});
				}
			},
			doSaveOtherOrganUsers : function(selectedDatas) {
				debugger;
				if (selectedDatas) {
					dataModel.mainModel.vo.otherOrganUsers = selectedDatas;
					var param = _.map(selectedDatas, function(data){return {id : data.id}});
					var _this = this;
					api.saveOtherOrganUsers({id : dataModel.mainModel.vo.id}, param).then(function() {
						_this.refreshTableData(_this.$refs.otherOrganUserTable);
					});
				}
			},
			doRemoveUsers : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeUsers({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					LIB.Msg.info("删除人员成功！");
					_this.$refs.userTable.doRefresh();
				});
			},
			doRemoveOtherOrganUsers : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeOtherOrganUsers({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					LIB.Msg.info("删除其他公司人员成功！");
					_this.$refs.otherOrganUserTable.doRefresh();
				});
			},
            doMenuAndFunc: function () {
				this.$emit("change-auth-menu", this.mainModel.vo.id, this.mainModel.vo.name);
            },
            doAlotData: function () {
                this.$emit("change-auth-data", this.mainModel.vo.id, this.mainModel.vo.name);
            },
			doEnableDisable:function(){
				var _this = this;
				var rows = [];
				rows.push(this.mainModel.vo);
				var disable = rows[0].disable;
				var ids = _.map(rows, function (row) {
					return row.id
				});
				if(disable=='0'){
					api.updateDisable(ids).then(function (res) {
						_.each(rows, function (row) {
							row.disable = '1';
						});
						_this.$emit("do-detail-update",rows);
						LIB.Msg.info("已停用!");
					});
				}else{
					api.updateStartup(ids).then(function (res) {
						_.each(rows, function (row) {
							row.disable = '0';
						});
						_this.$emit("do-detail-update",rows);
						LIB.Msg.info("已启用!");
					});
				}
			},
			afterInitData : function() {
				this.mainModel.vo.roleId = this.mainModel.vo.id;
				this.selectModel.otherOrganUserSelectModel.filterData.orgId = this.mainModel.vo.orgId;
                if (this.mainModel.action === 'copy') {
                    this.mainModel.vo.name += "（复制）";
                    if (!this.copyModel.isNeedCopyUser) {
                    	return;
					}
                }
                this.$refs.userTable.doQuery({id : this.mainModel.vo.id});
                this.$refs.otherOrganUserTable.doQuery({id : this.mainModel.vo.id});
            },
            beforeDoSave: function() {
                this.mainModel.vo.orgId = this.mainModel.vo.compId;
                if (this.mainModel.opType === 'copy') {
					this.doCopyAsRole();
                    return false;
				}
            },
            doCopyAsRole:function () {
                var _vo = dataModel.mainModel.vo;
                var _this = this;
                var _data = this.mainModel;
                this.$refs.ruleform.validate(function(valid) {
                    if (valid) {
                        api.copyRole({id : dataModel.mainModel.copyId},_vo).then(function(res) {
                            LIB.Msg.info("复制成功");
                            _data.vo.id = res.data.id;
                            _this.afterDoSave({ type: "C" }, res.body);
                            _this.changeView("view");
                            _this.$dispatch("ev_dtCreate");
                        });
                    }
                });
            },
            beforeInit: function(oVal, opt) {
                this.$refs.userTable.doClearData();
                this.$refs.otherOrganUserTable.doClearData();
			},
            doAdd4Copy2: function () {
                this.copyModel.isNeedCopyUser = false;
                this.copyModel.visible = true;
            },
            doSaveCopy: function () {
                this.$broadcast("ev_set_copy_parameter", this.copyModel.isNeedCopyUser);
                this.copyModel.visible = false;
                this.doAdd4Copy();
            },
            buildSaveData: function () {
                var param = this.mainModel.vo;
                if (this.mainModel.action === 'copy') {
                    param.isNeedCopyUser = (this.copyModel.isNeedCopyUser ? 1 : 0)
                }
                return param;
            }
		},
		events : {
			//selectUser框点击保存后事件处理
			"ev_userFinshed": function (nVal) {
				//刷新
				var _this = this;
				var _vo = dataModel.mainModel.vo;
				_vo.relList = [];
				api.get({id: nVal}).then(function (res) {
					_this.mainModel.vo.userList = res.data.userList;
					_this.$emit("do-detail-user-add", dataModel.mainModel.vo.userList);
				});

			},
			"ev_ohterOrganUserFinshed": function (nVal) {
				//刷新
				var _this = this;
				var _vo = dataModel.mainModel.vo;
				_vo.relList = [];
				api.get({id: nVal}).then(function (res) {
					_this.mainModel.vo.otherOrganUserList = res.data.userList;
					_this.$emit("do-detail-user-add", dataModel.mainModel.vo.otherOrganUserList);
				});

			},
            "ev_set_copy_parameter": function (isNeedCopyUser) {
                this.copyModel.isNeedCopyUser = isNeedCopyUser;
            }
		},
        init: function(){
            this.$api = api;
        }
	});

	return detail;
});