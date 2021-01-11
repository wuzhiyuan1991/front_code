define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			//消息id
			id : null,
			//内容
			content : null,
			//发布状态  1:已发布，0：未发布
			disable : 0,
			//标题
			title : null,
			//用户
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
				"title" : [LIB.formRuleMgr.require("消息主题"),LIB.formRuleMgr.length(50,1)],
				"content" : [LIB.formRuleMgr.require("消息内容"),LIB.formRuleMgr.length(200,1)],
	        },
	        emptyRules:{}
		},
		tableModel : {
			userTableModel : {
				url : "pushnotice/users/list/{curPage}/{pageSize}",
				columns : [{
					title : "编码",
					fieldName : "code",
                    keywordFilterName: "criteria.strValue.keyWordValue_code"
				},{
					title : "名称",
					fieldName : "name",
                    keywordFilterName: "criteria.strValue.keyWordValue_name"
				},{
					title : "",
					fieldType : "tool",
					toolType : "del"
				}]
			}
		},
		formModel : {
		},
		selectModel : {
			userSelectModel : {
				visible : false,
				filterData : {orgId : null}
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
		methods:{
			newVO : newVO,
			doShowUserSelectModal : function() {
				this.selectModel.userSelectModel.visible = true;
				//this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
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
				if(this.mainModel.vo.disable == 1) {
					LIB.Msg.warning("消息已发送，不能删除发送对象");
					return;
				}
				var _this = this;
				var data = item.entry.data;
				api.removeUsers({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.userTable.doRefresh();
				});
			},
			doPublish:function(){
				var _this = this;
				LIB.Modal.confirm({
					title:'确定发布?',
					onOk:function(){
						api.publish({id:_this.mainModel.vo.id}).then(function(res){
							LIB.Msg.success("发布成功");
							_this.mainModel.vo.status = 1;
							_this.mainModel.vo.disable = 1;
							_this.afterDoSave({type:"U"});
							_this.changeView("view");
							_this.$dispatch("ev_dtUpdate");
						})
						}
				});
			},
			afterInitData : function() {
				this.$refs.userTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.userTable.doClearData();
			}
		},
		events : {
		},
        init: function(){
        	this.$api = api;
        }
	});

	return detail;
});