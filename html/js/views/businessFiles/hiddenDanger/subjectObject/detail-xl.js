define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var checkTableSelectModal = require("componentsEx/selectTableModal/checkTableSelectModal");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	//var userSelect = require("componentsEx/userSelect/userSelect");

	
	//初始化数据模型
	var newVO = function() {
		return {
			//id
			id : null,
			//
			code : null,
			//对象名称
			name : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//是否禁用，0启用，1禁用
			disable : "0",
			//排序
			orderNo : null,
			//备注
			remarks : null,
			//类型 0 对象   1 对象类型
			type : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//检查表
			checkTables : [],
			firstUser:{id:"",name:""}
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			showCheckTableSelectModal : false,
			disableList: LIB.getDataDicList('disable'),
			
			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require(""),
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.require("对象名称"),
						  LIB.formRuleMgr.length()
				],
				"firstUser.id":[{required: true, message: '请选择负责人'},
					LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.require("状态"),
					LIB.formRuleMgr.length()],
				"compId" : [{required: true, message: '请选择所属公司'},
					LIB.formRuleMgr.length()],
				"orgId" : [{required: true, message: '请选择所属部门'},
					LIB.formRuleMgr.length()],
				"type" : [
					LIB.formRuleMgr.length()],
	        },
	        emptyRules:{}
		},
		tableModel : {
			checkTableTableModel : {
				url : "checkobject/checktables/list/{curPage}/{pageSize}",
				columns : [{
					title : "编码",
					fieldName : "code"
				},{
					title : "名称",
					fieldName : "name",
				},{
					title : "",
					fieldType : "tool",
					toolType : "del"
				}],
			},
		},
		formModel : {
		},
		selectModel : {
			userSelectModal : {
				filterData : {
					compId:null,
					orgId:null
				}
			},
            checkTableSelectModel : {
                filterData : {
                     disable : 0
                }
            },
			userSelectModel : {
				visible : false
			},
		},
		cardModel : {
			checkTableCardModel : {
				showContent : true
			},
		},
		orgName:null,
		//編輯的時候需要 控制器
		updateFlag:false
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
			"checktableSelectModal":checkTableSelectModal,
			//"userSelect":userSelect
			"userSelectModal":userSelectModal
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowUserTableSelectModal:function(){
				this.selectModel.userSelectModel.visible = true;
				this.selectModel.userSelectModal.filterData ={compId : this.mainModel.vo.compId, orgId : this.mainModel.vo.orgId};
			},
			doSaveUser:function(selectedDatas){
				if (selectedDatas && selectedDatas[0]) {
					var selectedData = selectedDatas[0];
					dataModel.mainModel.vo.firstUser = {id : selectedData.id, name : selectedData.name};
					//this.mainModel.vo.firstUser.name = data[0].username;
					//this.mainModel.vo.firstUser.id = data[0].id;
				}
			},
			selectUser:function(){
				this.mainModel.showUserTableSelectModal = true;
			},

			doSaveCheckTables : function(selectedDatas) {
				if (selectedDatas) {
					dataModel.mainModel.vo.checkTables = selectedDatas;
					var _this = this;
					api.saveCheckTables({id : dataModel.mainModel.vo.id}, selectedDatas).then(function() {
						_this.refreshTableData(_this.$refs.checktableTable);
					});
				}
			},
			doEnableDisable:function(){
				var _this = this;
				if(_this.mainModel.vo.disable=='0'){
					_this.mainModel.vo.disable="1"
					api.update(null,_this.mainModel.vo).then(function(data){
						if(data.data && data.error != '0'){
							return;
						}else{
							LIB.Msg.info("已停用");
							//_this.$dispatch("ev_dtCreate");
							_this.$emit("do-detail-finshed");
						}
					});
				}else{
					_this.mainModel.vo.disable="0"
					api.update(null,_this.mainModel.vo).then(function(data){
						if(data.data && data.error != '0'){
							return;
						}else{
							LIB.Msg.info("已启用");
							//_this.$dispatch("ev_dtCreate");
							_this.$emit("do-detail-finshed");
						}
					});
				}
			},
			doRemoveCheckTables : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeCheckTables({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.checktableTable.doRefresh();
				});
			},
			afterInitData : function() {
				dataModel.orgName = this.mainModel.vo.firstUser.username;
				this.$refs.checktableTable.doQuery({id : this.mainModel.vo.id});
;
			},
			beforeInit : function() {
                var compId = _.propertyOf(this.mainModel.vo)("compId");
                var orgId = _.propertyOf(this.mainModel.vo)("orgId");
                this.selectModel.userSelectModal.filterData = {compId : this.mainModel.vo.compId, orgId : this.mainModel.vo.orgId};
				this.$refs.checktableTable.doClearData();
			},

		},
        ready: function(){
        	this.$api = api;
        }
	});

	return detail;
});