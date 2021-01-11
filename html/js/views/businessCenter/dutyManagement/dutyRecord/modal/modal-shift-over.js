define(function (require) {
    var Vue = require("vue");
    var template = require("text!./modal-shift-over.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var api = require("../vuex/api");
    var LIB=require("lib");
	var vo = {
		
	}
    return Vue.extend({
        template: template,
		components : {
			"userSelectModal": userSelectModal
		},
        data: function () {
            return {
                modalTitle: "交班",
                title: "交接班模式",
                visible: false,
                modalStyle: {
                    minWidth: '500px',
                    maxWidth: '600px'
                },
				selectModel: null,
				checkTypeList: [
					{
				        id: "0",
				        value: "张三"
				    },
				    {
				        id: "1",
				        value: "李四"
				    }
				],
				mainModel: {
					opType: 'view',
					isReadOnly: false,
					title: "",
					isEnablePtwWporCard: false,
					vo: null,
					succession: null,
					successionOther: [],
					// 表单校验
					rules: {
						"succession": [
							{   
								required: true,
								validator: function (rule, val, cb) {
									if(_.isEmpty(val)) {
										return cb(new Error("不能为空，请选择"));
									}
									return cb();
								}
							}	
						]
					}
				},
				selectModel: {
					userSelectModel: {
					    visible: false,
					    filterData: {
					        "criteria.strValue.excludeUserPlanId": null
					    },
						single: false,
					    onlyType: -1
					}
				},
				compId: LIB.user.compId,
				// compId: "fdjrpck3nf",
				orgId: null,
				selectModelType: "0",
				nextDateTime: null
            }
        },
        methods: {          
			show: function(data) {
			    this.visible = true;
				this.mainModel.vo = data;
				this.mainModel.succession = null;
				if(data.dateDuty) {
					this.nextDateTime = data.dateDuty;
					var temp = new Date(data.dateDuty).getTime();
					temp = temp + 3600 * 24 * 1000;
					this.nextDateTime = new Date(temp).Format("yyyy-MM-dd");
				} else {
					this.nextDateTime = null;
				}
			},
			
			// 选择交接班模式
			shiftOverSelect: function(val, key) {
				this.selectModelType = val;
			},
			
			// 接班人选择框
			showSuccessionSelectModal: function(val) {
				this.selectModel.userSelectModel.visible = true;
				this.selectModel.userSelectModel.single = val;
			},
			
			doSaveUsers: function(data) {
				if(this.selectModel.userSelectModel.single) {
					this.mainModel.succession = data[0];
				} else {
					this.mainModel.successionOther = data;
				}
			},
			
            doSave: function () {
				var _this = this;
				this.$refs.ruleform.validate(function(valid) {
					if (valid) {
						var data = {
							id: _this.mainModel.vo.id,
							orgId: _this.mainModel.vo.orgId,
							submitUserId: LIB.user.id,
							receiveUserId: _this.mainModel.succession.id,
							// others: _.pluck(_this.mainModel.successionOther, 'id').join(',')
							others: _this.mainModel.successionOther.map(function(item) {
								return {id: item.id}
							})
						}
						if(_this.selectModelType == 0) {
							// 交班 创建值班记录
							api.shiftOverAddRecordsApi(null, data).then(function(res) {
								LIB.Msg.success("交班成功，有值班记录");
								_this.$dispatch("ev_dtUpdate");
								_this.$emit("close-detail-modal")
							});
						} else {
							// 交班 无值班记录
							api.shiftOverNoRecordsApi(null, data).then(function(res) {
								LIB.Msg.success("交班成功，无值班记录");
								_this.$dispatch("ev_dtUpdate");
								_this.$emit("close-detail-modal")
							});
						}
						_this.visible = false;
					}
				})
            },
			doClose: function () {
				this.selectModelType = "0";
				this.mainModel.succession = null;
				this.mainModel.successionOther = [];
			    this.visible = false;
			}
        },
    })
})