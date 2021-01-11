define(function (require) {
	//基础js
	var LIB = require('lib');
	var api = require("./vuex/api");
	var tpl = LIB.renderHTML(require("text!./main.html"));
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");


	var initDataModel = function () {
		return {
			checked: true,
			compId: '',
			selectModel: {
				userSelectModel: {
					visible: false,
					filterData: {
						compId: null,
						type: 0
					}
				},

			},
			treeModel: {
				data: [],
				selectedData: [],
				keyword: '',
				filterData: { id: '' },
				showLoading: false,
			},
			tableModel:
			{
				url: "msguser/list{/curPage}{/pageSize}",
				selectedDatas: [],
				columns: [
					{
						//人员的姓名
						title: "人员",
						fieldName: "userName",

					},
					_.extend(_.clone(LIB.tableMgr.column.company), { filterType: null }),
					_.extend(_.clone(LIB.tableMgr.column.dept), { filterType: null }),
					{
						title: "",
						fieldType: "tool",
						toolType: "del"
					}


				]
			},
			msgjson:null
		};

		
	}

	var vm = LIB.VueEx.extend({
		mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
		template: tpl,
		data: initDataModel,
		components: {
			'userSelectModal': userSelectModal
		},
		watch: {
			'treeModel.selectedData': function (val) {
				if (val.length > 0) {
					this.selectModel.userSelectModel.filterData.compId= val[0].id
					this.$refs.itemTable.doQuery({ compId: val[0].id })
				} else {
					this.$refs.itemTable.doClearData()
				}
			},

		},
		methods: {
			doSaveJson:function(){
				api.updateMsgjson(this.msgjson).then(function(res){
					LIB.Msg.success("保存成功")
				})
			},
			doSelectUser: function () {

				this.selectModel.userSelectModel.visible = true
			},
			doSaveUsers: function (selectedDatas) {
				var _this = this
				var data = _.map(selectedDatas, function (item) { return { userId: item.id, userName: item.name ,orgId:item.orgId} })
				api.addMsguser({ compId: this.treeModel.selectedData[0].id }, data).then(function () {
					_this.$refs.itemTable.doRefresh()
					LIB.Msg.success("添加成功")
				});
			},
			doRemoveUsers: function (item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前人员?',
					onOk: function () {
						api.deleteMsguser({}, {id : data.id}).then(function() {
							_this.$refs.itemTable.doRefresh();
						    LIB.Msg.info("删除成功")
							
						});
					}
				});
			},
		},
		events: {
		},
		init: function () {
			this.$api = api;
		},
		ready: function () {
			var _this = this;
			var orgList = _.filter(LIB.setting.orgList, function (item) {
				return item.disable !== '1'
			});
			//触发treeModel.data数据变化的事件， 必需先设置为空数据组
			this.treeModel.data = [];
			// 增加树加载提示
			if (orgList.length > 300) {
				this.treeModel.showLoading = true;
				
				//延迟防止卡顿

				var intervalId = setTimeout(function () {
					_this.treeModel.data =_.filter(_.sortBy(orgList, "type"),function(item){
						return item.type==1
					});
					_this.treeModel.selectedData = _.filter(_this.treeModel.data, function (item) {
						return item.parentId == undefined
					})

					clearTimeout(intervalId);
					_this.treeModel.showLoading = false;
				}, 300);
			} else if (orgList.length > 0) {
				this.treeModel.data = _.filter(_.sortBy(orgList, "type"),function(item){
					return item.type==1
				});
				_this.treeModel.selectedData = _.filter(_this.treeModel.data, function (item) {
					return item.parentId == undefined
				})

			}
			api.queryMsgjson().then(function(res){
				_this.msgjson=res.data
			})
		}
	});
	return vm;
});
