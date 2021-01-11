define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	
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
			roleId: null,
			userList:null,
			compId:null,
			orgId:null,
			attr1:"5"
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
				code : [LIB.formRuleMgr.require("权限编码"),
					LIB.formRuleMgr.length()
				],
				name: [
					{required: true, message: '请输入权限名称'},
				],
                compId :[
                    {required: true, message: '请选择所属公司'},
                ]
			},
			copyId:null,
	        emptyRules:{},
            keyword: '',
			showSearchInput: false
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
                    }
				},{
					title : "名称",
					fieldName : "name",

				},{
					title : "",
					fieldType : "tool",
					toolType : "del"
				}],
                keyWord: ''
			},
		},
		formModel : {
		},
		selectModel:{
			userSelectModel:{
				visible:false,
                filterData: {
                    compId: null,
                }
			}
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
                this.selectModel.userSelectModel.filterData ={compId : this.mainModel.vo.compId};
			},
			// doSaveUsers : function(selectedDatas) {
			// 	if (selectedDatas) {
			// 		dataModel.mainModel.vo.users = selectedDatas;
			// 		var param = _.map(selectedDatas, function(data){return {id : data.id}});
			// 		var _this = this;
			// 		api.saveUsers({id : dataModel.mainModel.vo.id}, param).then(function() {
			// 			_this.refreshTableData(_this.$refs.userTable);
			// 		});
			// 	}
			// },
			// doRemoveUsers : function(item) {
			// 	var _this = this;
			// 	var data = item.entry.data;
			// 	api.removeUsers({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
			// 		LIB.Msg.info("删除人员成功！");
			// 		_this.$refs.userTable.doRefresh();
			// 	});
			// },
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
			},
            beforeDoSave: function() {
                this.mainModel.vo.orgId = this.mainModel.vo.compId;
                if (this.mainModel.opType == 'copy') {
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
				if (opt.opType == 'copy') {
                    var _vo = dataModel.mainModel.vo;
                    _.extend(_vo,newVO());
                    _vo.name = oVal.name+"(复制)";
                    _vo.compId = oVal.compId;
                    this.mainModel.copyId = oVal.id;
                    this.mainModel.isReadOnly = false;
                    this.mainModel.opType = opt;
                    this.mainModel.title = this.$tc("ori.rolm.copy");
				}
			},
            toggleSearchInput: function () {
				this.mainModel.keyword = '';
				this.mainModel.showSearchInput = !this.mainModel.showSearchInput;
            },
            doFilter: function () {
                this.$refs.userTable.doFilter();
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
		},
        created: function(){
            this.$api = api;
        }
	});

	return detail;
});