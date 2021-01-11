define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var concatorUserSelectModal = require("componentsEx/selectTableModal/concatorMemberSelectModal");
	var contractorSelectModal = require("componentsEx/selectTableModal/contractorSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//角色ID
			id : null,
			//角色编码
			code : null,
			attr1: "20",
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
			roleId: null,
			userList:null,
			compId:null,
			orgId:null,
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
					
					{validator: function (rule, value, callback) {
						
						 
					
							if (value=='') {
								value=null
								return callback(new Error('权限名称不能为空'));
							}
								
							
					
							if (value.length>20) {
								return callback(new Error('权限名称长度不能超过20'));
							}
							
						
						
						return callback();
					}},
				]
			},
			copyId:null,
	        emptyRules:{}
		},
		tableModel : {
			userTableModel : {
				url : "contractorrole/contractoremps/list/{curPage}/{pageSize}",
				columns : [
				// 	{
				// 	title : "编码",
                 //    fieldType: "custom",
                 //    pathCode: LIB.ModuleCode.BS_OrI_PerM,
                 //    render: function(data) {
                 //        if (data.code) {
                 //            return data.code;
                 //        }
                 //    },
                 //    keywordFilterName: "criteria.strValue.keyWordValue_code"
				// },
					{
					title : "姓名",
					fieldName : "name",
                    keywordFilterName: "criteria.strValue.keyWordValue_name"
				},
					{
                        title : "承包商",
						fieldName : "contractor.deptName",
						fieldType:'link'
					},
					{
					title : "",
					fieldType : "tool",
					toolType : "del"
				}]
			},
			contractorTableModel : LIB.Opts.extendDetailTableOpt({
				url : "contractorrole/contractors/list/{curPage}/{pageSize}",
				columns : [
					// LIB.tableMgr.ksColumn.code,
					{
						title : "名称",
						fieldName : "deptName",
						fieldType:'link',
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					},
					(function () {
						var obj = LIB.tableMgr.column.company;
						obj = _.clone(obj);
						obj.width = 180;
						delete obj.filterType;
						return obj;
                    })(),
                    {
						title : "",
						fieldType : "tool",
						toolType : "del"
					}]
			}),
		},
		formModel : {
		},
		selectModel:{
			userSelectModel:{
				visible:false,
                filterData: {
                    compId: null,
                }
			},
			contractorSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
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
			"concatorUserSelectModal":concatorUserSelectModal,
			"contractorSelectModal":contractorSelectModal,
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
			doTableCellClick:function(row){
				var router = LIB.ctxPath("/html/main.html#!");
				var cell = row.cell
            if (cell.fieldName=='contractor.deptName') {
				var routerPart="/contractor/contractor?method=detail&&id="+row.entry.data.contractor.id+'&&code='+row.entry.data.contractor.code;
				window.open(router + routerPart);
			}else if(cell.fieldName=='deptName'){
				var routerPart="/contractor/contractor?method=detail&&id="+row.entry.data.id+'&&code='+row.entry.data.code;
				window.open(router + routerPart);
			}
			 
			},
			newVO : newVO,
			doShowContractorSelectModal : function() {
				this.selectModel.contractorSelectModel.visible = true;
				//this.selectModel.contractorSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveContractors : function(selectedDatas) {
				if (selectedDatas) {
					dataModel.mainModel.vo.contractors = selectedDatas;
					var param = _.map(selectedDatas, function(data){return {id : data.id}});
					var _this = this;
					api.saveContractors({id : dataModel.mainModel.vo.id}, param).then(function() {
						_this.refreshTableData(_this.$refs.contractorTable);
					});
				}
			},
			doRemoveContractor : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeContractors({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.contractorTable.doRefresh();
						});
					}
				});
			},
			doShowUserSelectModel:function(){
				this.selectModel.userSelectModel.visible = true;
                this.selectModel.userSelectModel.filterData ={compId : this.mainModel.vo.compId};
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
			doRemoveUsers : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeUsers({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					LIB.Msg.info("删除人员成功！");
					_this.$refs.userTable.doRefresh();
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
                if (this.mainModel.action === 'copy') {
                    this.mainModel.vo.name += "（复制）";
                    if (!this.copyModel.isNeedCopyUser) {
                    	return;
					}
                }
                this.$refs.userTable.doQuery({id : this.mainModel.vo.id});
				this.$refs.contractorTable.doQuery({id : this.mainModel.vo.id});
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
				this.$refs.contractorTable.doClearData();
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