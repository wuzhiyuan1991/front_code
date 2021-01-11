define(function(require) {
	var Vue = require("vue");
	var template = require("text!./modal-succession.html");
	var api = require("../vuex/api");
	var LIB = require("lib");
	return Vue.extend({
		template: template,
		data: function() {
			return {
				modalTitle: "接班",
				title: "当前接班的班次的值班日期为",
				visible: false,
				modalStyle: {
					minWidth: '500px',
					maxWidth: '600px'
				},
				selectModelType: "0",
				selectChecked: false,
				time: new Date(),
				mainModel: { 
					vo: {
						id: null,
						dutyRecordId: null,
						dateDuty: null,
						remark: null
					}
				}
			}
		},
		watch: {
			visible: function(val) {
				// 时间自动更新
				var _this = this;
				if (val) {
					_this.time = new Date();
					this.timer = setInterval(function() {
						_this.time = new Date();
					}, 1000)
				} else if (this.timer) {
					_this.time = null;
					clearInterval(this.timer)
				}
			}
		},
		methods: {
			// 格式化时间 年-月-日-时-分-秒
			// formatDate: function() {
			// 	var date = new Date();
			// 	var y = date.getFullYear();
			// 	var MM = date.getMonth() + 1;
			// 	MM = MM < 10 ? ('0' + MM) : MM;
			// 	var d = date.getDate();
			// 	d = d < 10 ? ('0' + d) : d;
			// 	var h = date.getHours();
			// 	h = h < 10 ? ('0' + h) : h;
			// 	var m = date.getMinutes();
			// 	m = m < 10 ? ('0' + m) : m;
			// 	var s = date.getSeconds();
			// 	s = s < 10 ? ('0' + s) : s;
			// 	return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
			// },
			
			show: function(data) {
				this.visible = true;
				this.mainModel.vo = data;
			},
			
			// 选择同意、不同意
			shiftSuccession: function(val, key) {
				this.selectModelType = val;
			},

			doSave: function() {
				var _this = this;
				var data = {
					id: this.mainModel.vo.id,
					// dutyRecordId: this.mainModel.vo.dutyRecordId,
					dateDuty: this.mainModel.vo.dateDuty,
					remark: this.mainModel.vo.remark,
				}
				if (this.selectChecked == false) {
					// LIB.Modal.confirm({ title: "请点击已阅读" });
					LIB.Msg.info("请点击已阅读");
					return false
				}
				if (this.selectModelType == 0) {
					// 同意接班
					api.successAgreeApi(null, data).then(function(res) {
						LIB.Msg.success("接班成功");
						_this.$dispatch("ev_dtUpdate");
						_this.$emit("close-detail-modal")
					});
				} else {
					// 不同意接班
					api.successDisagreeApi(null, data).then(function(res) {
						LIB.Msg.error("接班失败");
                        _this.$dispatch("ev_dtUpdate");
						_this.$emit("close-detail-modal")
					});
				}
				this.visible = false;
			},

			doClose: function() {
				this.selectChecked = false;
				this.selectModelType = "0";
				this.mainModel.vo.remark = null;
				this.visible = false;
			}
		},
	})
})