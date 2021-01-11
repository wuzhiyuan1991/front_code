define(function(require){
	var api = require("../vuex/api");
	var LIB = require('lib');
	var tpl = require("text!./modal-add-edit-product.html");
	var productSelectModal = require("componentsEx/selectTableModal/userSelectModal");

	// 初始化数据
	var newVO = function() {
		return {
			id: null,
			startDate: null,
			endDate: null,
			users: null,
			recordsUsers: null,
			workRecord: null,
			eventContent: null
		}
	};

	// Vue数据
	var dataModel = {
		mainModel : {
			vo: newVO(),
			opType: 'create',
			isReadOnly: false,
			title: "添加",
			// 表单校验
	        rules: {
				"startDate": [
					{ required: true, message: "请选择" }
				],
				"recordsUsers": [
					{   
						required: true,
						validator: function (rule, val, cb) {
							if(_.isEmpty(val)) {
								return cb(new Error("不能为空，请选择"));
							}
							return cb();
						}
					}
				],
				"eventContent": [ LIB.formRuleMgr.length(500, 0) ]
	        },
	        emptyRules:{}
		},
		selectModel: {
			productSelectModel: {
				visible: false,
				filterData: {orgId: null}
			}
		},
	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components: {
			"productSelectModal": productSelectModal
		},
		data:function(){
			return dataModel;
		},
		methods: {
			newVO: newVO,
			doSaveUsers: function(data) {
				this.mainModel.vo.recordsUsers = _.map(data, function(item) {
					return {
						id: item.id, 
						name: item.name
					}
				});
			},
			init: function(data, recordId) {
				this.mainModel.vo = new newVO();
				this.mainModel.opType = 'create';
				this.mainModel.title = '添加-生产记事';
				if(data) {
					// _.extend(this.mainModel.vo, data.entry.data);
					this.mainModel.opType = 'update';
					this.mainModel.title = '编辑-生产记事';
					_.extend(this.mainModel.vo, data)
				}
				if(recordId) {
					this.mainModel.vo.recordId = recordId;
				}
			},
			doSaveMaintain: function (arr) {
				this.mainModel.vo.users = arr;
			},
			doSave: function () {
				var _this = this;
				this.$refs.ruleform.validate(function(valid) {
					if (valid) {
						if(_this.mainModel.vo.startDate) {
							var tempStartDate = _this.mainModel.vo.startDate.slice(0, 16) + ":00";
							_this.mainModel.vo.startDate = tempStartDate;
						}
						if(_this.mainModel.vo.endDate) {
							var tempEndDate = _this.mainModel.vo.endDate.slice(0, 16) + ":00";
							_this.mainModel.vo.endDate = tempEndDate;
						}
						_this.showAddProduct(_this.mainModel.vo);
						_this.visible = false;
					}
				})
			},
			showAddProduct: function(data) {
				var _this = this;
				// var arr = _.pluck(this.mainModel.vo.recordsUsers, "id").join(',')
				// this.mainModel.vo.recordsUsers = arr;
				// var data = item.entry.data;
				var recordsUsers = _.map(this.mainModel.vo.recordsUsers, function(item) {
					return { id: item.id }
				});
				var params = _.clone(this.mainModel.vo);
				params.recordsUsers = recordsUsers;
				if(this.mainModel.opType == "create") {
					api.addProductRecordApi(null, params).then(function(res) {
						_this.$emit("refresh-duty-record")
					});
				} else if (this.mainModel.opType == "update") {
					api.editProductRecordApi(null, params).then(function(res) {
						_this.$emit("refresh-duty-record")
					})
				}
			},
			getUUID: function() {
				var _this = this;
				api.getUUID().then(function (res) {
					var data = res.data;
					 _this.mainModel.vo.id = data;
				});
			},
			doClose: function () {
			    this.visible = false;
			},
			showProductSelectModal: function(val) {
				this.optType = val;
				this.selectModel.productSelectModel.visible = true;
				this.selectModel.productSelectModel.filterData = {orgId : this.orgId};
			}
		}
	});
	return detail;
});