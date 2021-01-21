
define(function (require) {
	//基础js
	var LIB = require('lib');
	var api = require("./vuex/api");




	//vue数据
	var newVO = function () {
		return {
			id: null,
			name: null,
			parentId: null,
			code: null,
			orderNo: null
		}
	};

	//vue数据 配置url地址 拉取数据
	var dataModel = {
		mainModel: {
			vo: newVO(),
			flag: null,
			type: true,
			addType: false,
			addFlag: null,
		},
		rules: {
			code: [
				{ required: true, message: LIB.lang('em.ms.petc') },
				LIB.formRuleMgr.length(20, 1)
			],
			name: [
				{ required: true, message: LIB.lang('em.ms.pean') },
				LIB.formRuleMgr.length(20, 1)
			],
			orderNo: [
				{ type: 'positiveInteger', message: LIB.lang('em.ms.opicbe') }
			]
		}
	};
	var vm = LIB.VueEx.extend({
		template: require("text!./edit.html"),
		data: function () {
			return dataModel;
		},
		//引入html页面
		methods: {

			doSave: function () {
				var _this = this;
				var _vo = dataModel.mainModel.vo;
				//var obj ={
				//	name : dataModel.mainModel.vo.name,
				//	parentId : dataModel.mainModel.vo.parentId,
				//	code :dataModel.mainModel.vo.code,
				//	orderNo :dataModel.mainModel.vo.orderNo
				//};
				var obj = _.omit(_this.mainModel.vo, "id");
				//判断是否为 导航的新增 还是树上面的新增
				this.$refs.ruleform.validate(function (valid) {
					if (valid) {
						if (dataModel.mainModel.addType) {
							if (dataModel.mainModel.addFlag == "risktype") {
								api.createRiskType(null, obj).then(function (data) {
									_vo.id = data.body.id;
									LIB.Msg.info(LIB.lang('gb.common.addedsuf'));
									//_this.$dispatch("ev_editAdd", dataModel.mainModel,"risktype");
									_this.$emit("doeditadd", dataModel.mainModel, "risktype");
								})
							} else if (dataModel.mainModel.addFlag == "checkbasistype") {
								api.createCheckBasisType(null, { name: dataModel.mainModel.vo.name, code: dataModel.mainModel.vo.code, orderNo: dataModel.mainModel.vo.orderNo }).then(function (data) {
									_vo.id = data.body.id;
									LIB.Msg.info(LIB.lang('gb.common.addedsuf'));
									_this.$emit("doeditadd", dataModel.mainModel, "checkbasistype");
								})
							} else if (dataModel.mainModel.addFlag == "listTableType") {
								api.createTableType(null, obj).then(function (data) {
									_vo.id = data.body.id;
									LIB.Msg.info(LIB.lang('gb.common.addedsuf'));
									_this.$emit("doeditadd", dataModel.mainModel, "listTableType");
								})
							} else if (dataModel.mainModel.addFlag == "equipmentType") {
								api.createEquipmentType(null, obj).then(function (data) {
									_vo.id = data.body.id;
									LIB.Msg.info(LIB.lang('gb.common.addedsuf'));
									_this.$emit("doeditadd", dataModel.mainModel, "equipmentType");
								})
							} else if (dataModel.mainModel.addFlag == "industryCategory") {
								api.createIndustryCategory(null, obj).then(function (data) {
									_vo.id = data.body.id;
									LIB.Msg.info(LIB.lang('gb.common.addedsuf'));
									_this.$emit("doeditadd", dataModel.mainModel, "industryCategory");
								})
							} else if (dataModel.mainModel.addFlag == "courseCategory") {
								api.createCourseCategory(null, obj).then(function (data) {
									_vo.id = data.body.id;
									LIB.Msg.info(LIB.lang('gb.common.addedsuf'));
									_this.$emit("doeditadd", dataModel.mainModel, "courseCategory");
								})
							} else if (dataModel.mainModel.addFlag == "certificationSubject") {
								api.createCertificationSubject(null, obj).then(function (data) {
									_vo.id = data.body.id;
									LIB.Msg.info(LIB.lang('gb.common.addedsuf'));
									_this.$emit("doeditadd", dataModel.mainModel, "certificationSubject");
								})
							}

						} else {
							if (dataModel.mainModel.type) {
								var callback1 = function (res) {
									_vo.id = res.body.id;
									LIB.Msg.info(LIB.lang('gb.common.addedsuf'));
									_this.$emit("doupdate", dataModel.mainModel, "add", dataModel.mainModel.flag);
								}
								if (dataModel.mainModel.flag == "risktypeAdd") {
									//新增 业务中心 ---危害因素 业务档案 ---检查项的新增或者修改
									api.createRiskType(null, obj).then(callback1)
								} else if (_this.mainModel.flag == "checkbasistypeAdd") {
									////业务档案---风险评估---检查依据
									api.createCheckBasisType(null, { name: dataModel.mainModel.vo.name, code: dataModel.mainModel.vo.code, orderNo: dataModel.mainModel.vo.orderNo }).then(callback1)
								} else if (_this.mainModel.flag == "listTableTypeAdd") {
									//业务档案--隐患排除---检查表
									api.createTableType(null, obj).then(callback1)
								} else if (_this.mainModel.flag == "equipmentTypeAdd") {
									//设备设施
									api.createEquipmentType(null, obj).then(callback1)
								} else if (_this.mainModel.flag == "industryCategoryAdd") {
									//行业分类
									api.createIndustryCategory(null, obj).then(callback1)
								} else if (_this.mainModel.flag == "courseCategoryAdd") {
									//课程类型
									api.createCourseCategory(null, obj).then(callback1)
								} else if (_this.mainModel.flag == "certificationSubjectAdd") {
									//取证类型
									api.createCertificationSubject(null, obj).then(callback1)
								}

							} else {
								var updateObj = _.omit(_this.mainModel.vo, "parentId");
								//var _this=this;
								var callback2 = function (res1) {
									LIB.Msg.info(LIB.lang('gb.common.modifieds'));
									_this.$emit("doupdate", dataModel.mainModel, "updata", dataModel.mainModel.flag);
								}
								if (dataModel.mainModel.flag == "risktypeUpdata") {
									api.updateRiskType(null, updateObj).then(callback2);
								} else if (dataModel.mainModel.flag == "checkbasistypeUpdata") {
									api.updateCheckBasisType(null, updateObj).then(callback2);
								} else if (dataModel.mainModel.flag == "listTableTypeUpdata") {
									api.updateTableType(null, updateObj).then(callback2);
								} else if (dataModel.mainModel.flag == "equipmentTypeUpdata") {
									api.updateEquipmentType(null, updateObj).then(callback2);
								} else if (dataModel.mainModel.flag == "industryCategoryUpdata") {
									api.updateIndustryCategory(null, updateObj).then(callback2);
								} else if (dataModel.mainModel.flag == "courseCategoryUpdata") {
									api.updateCourseCategory(null, updateObj).then(callback2);
								} else if (dataModel.mainModel.flag == "certificationSubjectUpdata") {
									api.updateCertificationSubject(null, updateObj).then(callback2);
								}
							}
						}
					}
				});

			},
		},
		events: {
			//点击取得id跟name值 双向绑定
			"ev_detailReload": function (data, nVal, type) {
				var _vo = dataModel.mainModel.vo;
				this.mainModel.flag = nVal;
				//清空数据
				_.extend(_vo, newVO());
				this.mainModel.addType = false;
				if (type == "add") {
					dataModel.mainModel.vo.parentId = data.data.id;
					this.mainModel.type = true;
				} else if (type == "updata") {
					_.deepExtend(_vo, data.data);
					this.mainModel.type = false;
				}
				////判断是否为业务中心 ---危害因素 业务档案 ---检查项的新增或者修改
				//if(nVal =="risktypeUpdata"){
				//	_.deepExtend(_vo, data.data);
				//	this.mainModel.type=false;
				//}else if(nVal =="risktypeAdd"){
				//	dataModel.mainModel.vo.parentId = data.data.id;
				//	this.mainModel.type=true;
				//}
				////业务档案---风险评估---检查依据
				//else if(nVal == "checkbasistypeUpdata"){
				//	_.deepExtend(_vo, data.data);
				//	this.mainModel.type=false;
				//}else if(nVal == "checkbasistypeAdd"){
				//	dataModel.mainModel.vo.parentId = data.data.id;
				//	this.mainModel.type=true;
				//}
				////业务档案--隐患排除---检查表
				//else if(nVal =="listTableTypeAdd"){
				//	dataModel.mainModel.vo.parentId = data.data.id;
				//	this.mainModel.type=true;
				//}else if(nVal =="listTableTypeUpdata"){
				//	_.deepExtend(_vo, data.data);
				//	this.mainModel.type=false;
				//}
				////设备设施
				//else  if(nVal =="equipmentTypeAdd"){
				//	dataModel.mainModel.vo.parentId = data.data.id;
				//	this.mainModel.type=true;
				//}else if(nVal =="equipmentTypeUpdata"){
				//	_.deepExtend(_vo, data.data);
				//	this.mainModel.type=false;
				//}
				////行业分类
				//else  if(nVal =="industryCategoryAdd"){
				//	dataModel.mainModel.vo.parentId = data.data.id;
				//	this.mainModel.type=true;
				//}else if(nVal =="industryCategoryUpdata"){
				//	_.deepExtend(_vo, data.data);
				//	this.mainModel.type=false;
				//}
				//
				////课程类型
				//else  if(nVal =="courseCategoryAdd"){
				//	dataModel.mainModel.vo.parentId = data.data.id;
				//	this.mainModel.type=true;
				//}else if(nVal =="courseCategoryUpdata"){
				//	_.deepExtend(_vo, data.data);
				//	this.mainModel.type=false;
				//}
				//
				////取证类型
				//else  if(nVal =="certificationSubjectAdd"){
				//	dataModel.mainModel.vo.parentId = data.data.id;
				//	this.mainModel.type=true;
				//}else if(nVal =="certificationSubjectUpdata"){
				//	_.deepExtend(_vo, data.data);
				//	this.mainModel.type=false;
				//}
			},
			"ev_detailrisktypeAdd": function (val) {
				var _vo = dataModel.mainModel.vo;
				//清空数据
				_.extend(_vo, newVO());
				this.mainModel.addFlag = val;
				this.mainModel.addType = true;
			}

		}
	})
	return vm;
})