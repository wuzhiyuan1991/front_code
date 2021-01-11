
define(function(require){
	//基础js
	var LIB = require('lib');
	var api = require("./vuex/api");
	//vue数据
	var newVO = function () {
		return {
			id:null,
			name: null,
			parentId:null,
			code:null,
			orderNo:1
		}
	};

	//vue数据 配置url地址 拉取数据
	var dataModel = {
		mainModel: {
			vo: newVO(),
			flag:null,
			type:true,
			addType:false,
			addFlag:null,
			//控制是否必填
			requiredInform:false,
			//用来显示是否排序
			sort:null,
		},
		rules: {
			code: [
				{required: true, message: '请输入编码'},
				LIB.formRuleMgr.length(20, 1)
			],
			name: [
				{required: true, message: '请输入名称'},
				LIB.formRuleMgr.length(20, 1)
			],
			orderNo:[
                {
                    validator: function(rule, value, callback) {
                        return (value < 1 || parseInt(value, 10) != value) ? callback(new Error('只能输入正整数')) : callback();
                    }
                }
			]
		},
		emptyRules:{
			code: [
				{required: true, message: '请输入编码'},
				LIB.formRuleMgr.length(20, 1)
			],
			name: [
				{required: true, message: '请输入名称'},
				LIB.formRuleMgr.length(20, 1)
			],
			//orderNo:[
             //   LIB.formRuleMgr.require("排序"),
             //   {
             //       validator: function(rule, value, callback) {
             //           return (value < 1 || parseInt(value, 10) != value) ? callback(new Error('只能输入正整数')) : callback();
             //       }
             //   }
			//]
		}
	};
	var vm = LIB.VueEx.extend({
		template: require("text!./edit.html"),
		data:function(){
			return dataModel;
		},
		//引入html页面
		methods:{

			doSave:function(){
				var _this=this;
				var _vo = dataModel.mainModel.vo;
				//var obj ={
				//	name : dataModel.mainModel.vo.name,
				//	parentId : dataModel.mainModel.vo.parentId,
				//	code :dataModel.mainModel.vo.code,
				//	orderNo :dataModel.mainModel.vo.orderNo
				//};
				 var obj = _.omit(_this.mainModel.vo,"id");
				//判断是否为 导航的新增 还是树上面的新增
				this.$refs.ruleform.validate(function (valid){
						if (valid) {
							if(dataModel.mainModel.addType){
								if(dataModel.mainModel.addFlag=="risktype"){
									api.createRiskType(null, obj).then(function(data){
										_vo.id = data.body.id;
										LIB.Msg.info("添加成功");
										//_this.$dispatch("ev_editAdd", dataModel.mainModel,"risktype");
										_this.$emit("doeditadd", dataModel.mainModel,"risktype");
									})
								}else if(dataModel.mainModel.addFlag=="checkBasisType"){
									api.createCheckBasisType(null,{name:dataModel.mainModel.vo.name,code:dataModel.mainModel.vo.code,orderNo:dataModel.mainModel.vo.orderNo}).then(function(data){
										_vo.id = data.body.id;
										LIB.Msg.info("添加成功");
										_this.$emit("doeditadd", dataModel.mainModel,"checkBasisType");
									})
								}else if(dataModel.mainModel.addFlag=="listTableType"){
									api.createTableType(null,obj).then(function(data){
										_vo.id = data.body.id;
										LIB.Msg.info("添加成功");
										_this.$emit("doeditadd", dataModel.mainModel,"listTableType");
									})
								}else if(dataModel.mainModel.addFlag=="equipmentType"){
                                    api.createEquipmentType(null,obj).then(function(data){
                                        _vo.id = data.body.id;
                                        LIB.Msg.info("添加成功");
                                        _this.$emit("doeditadd", dataModel.mainModel,"equipmentType");
                                    })
                                }else if(dataModel.mainModel.addFlag=="tpaEquipmentType"){
                                    api.createTpaEquipmentType(null,obj).then(function(data){
                                        _vo.id = data.body.id;
                                        LIB.Msg.info("添加成功");
                                        _this.$emit("doeditadd", dataModel.mainModel,"tpaEquipmentType");
                                    })
                                }else if(dataModel.mainModel.addFlag=="cbEquipmentType"){
                                    api.createCbEquipmentType(null,obj).then(function(data){
                                        _vo.id = data.body.id;
                                        LIB.Msg.info("添加成功");
                                        _this.$emit("doeditadd", dataModel.mainModel,"cbEquipmentType");
                                    })
                                }else if(dataModel.mainModel.addFlag=="tpaRiskType"){
                                    api.createTpaRiskType(null,obj).then(function(data){
                                        _vo.id = data.body.id;
                                        LIB.Msg.info("添加成功");
                                        _this.$emit("doeditadd", dataModel.mainModel,"tpaRiskType");
                                    })
                                }

							}else{
								if(dataModel.mainModel.type){
									var callback1 = function (res) {
										_vo.id = res.body.id;
										LIB.Msg.info("添加成功");
										_this.$emit("doupdate", dataModel.mainModel, "add",dataModel.mainModel.flag);
									}
									if(dataModel.mainModel.flag=="risktypeAdd"){
										//新增 业务中心 ---危害因素 业务档案 ---检查项的新增或者修改
										api.createRiskType(null, obj).then(callback1)
									}else if(_this.mainModel.flag=="checkbasistypeAdd"){
										////业务档案---风险评估---检查依据
										api.createCheckBasisType(null,{name:dataModel.mainModel.vo.name,code:dataModel.mainModel.vo.code,orderNo:dataModel.mainModel.vo.orderNo}).then(callback1)
									}else if(_this.mainModel.flag=="listTableTypeAdd"){
										//业务档案--隐患排除---检查表
										api.createTableType(null,obj).then(callback1)
									}else if(_this.mainModel.flag=="equipmentTypeAdd"){
										//设备设施
										api.createEquipmentType(null,obj).then(callback1)
									}else if(_this.mainModel.flag=="tpaEquipmentTypeAdd"){
                                        //设备设施
                                        api.createTpaEquipmentType(null,obj).then(callback1)
                                    }else if(_this.mainModel.flag=="cbEquipmentTypeAdd"){
                                        //设备设施
                                        api.createCbEquipmentType(null,obj).then(callback1)
                                    }else if(_this.mainModel.flag=="tpaRiskTypeAdd"){
                                        //tap检查项分类
                                        api.createTpaRiskType(null,obj).then(callback1)
                                    }

								}else{
									var updateObj = _.omit(_this.mainModel.vo,"parentId");
									//var _this=this;
									var callback2 = function (res1) {
										LIB.Msg.info("修改成功");
										_this.$emit("doupdate",dataModel.mainModel,"update",dataModel.mainModel.flag);
									}
									if(dataModel.mainModel.flag=="risktypeUpdate"){
										api.updateRiskType(null, updateObj).then(callback2);
									}else if(dataModel.mainModel.flag=="checkbasistypeUpdate"){
										api.updateCheckBasisType(null, updateObj).then(callback2);
									}else if(dataModel.mainModel.flag=="listTableTypeUpdate"){
										api.updateTableType(null, updateObj).then(callback2);
									}else if(dataModel.mainModel.flag=="equipmentTypeUpdate"){
										api.updateEquipmentType(null, updateObj).then(callback2);
									}else if(dataModel.mainModel.flag=="tpaEquipmentTypeUpdate"){
                                        api.updateTpaEquipmentType(null, updateObj).then(callback2);
                                    }else if(dataModel.mainModel.flag=="cbEquipmentTypeUpdate"){
                                        api.updateCbEquipmentType(null, updateObj).then(callback2);
                                    }else if(dataModel.mainModel.flag=="tpaRiskTypeUpdate"){
                                        api.updateTpaRiskType(null, updateObj).then(callback2);
                                    }
								}
							}
						}});

			},
		},
		events:{
			//点击取得id跟name值 双向绑定
			"ev_detailReload" : function(data,nVal,type) {
				var _vo = dataModel.mainModel.vo;
				this.mainModel.flag = nVal;
				//清空数据
				_.extend(_vo, newVO());
				this.mainModel.addType = false;
				this.mainModel.sort = true;
				if(type=="add"){
						dataModel.mainModel.vo.parentId = data.data.id;
						this.mainModel.type=true;
				}else if(type=="update"){
						_.deepExtend(_vo, data.data);
						this.mainModel.type=false;
				}
				//如果选择的是行业分类课程分类取证类型 就直接sort赋值给orderNo
				if(nVal=="industryCategoryUpdate"|| nVal=="industryCategoryAdd"|| nVal=="courseCategoryAdd"|| nVal=="courseCategoryUpdate"||
					nVal=="certificationSubjectAdd"|| nVal=="certificationSubjectUpdate"){
					   this.mainModel.sort = false;
				}
				////判断是否为业务中心 ---危害因素 业务档案 ---检查项的新增或者修改
				//if(nVal =="risktypeUpdate"){
				//	_.deepExtend(_vo, data.data);
				//	this.mainModel.type=false;
				//}else if(nVal =="risktypeAdd"){
				//	dataModel.mainModel.vo.parentId = data.data.id;
				//	this.mainModel.type=true;
				//}
				////业务档案---风险评估---检查依据
				//else if(nVal == "checkbasistypeUpdate"){
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
				//}else if(nVal =="listTableTypeUpdate"){
				//	_.deepExtend(_vo, data.data);
				//	this.mainModel.type=false;
				//}
				////设备设施
				//else  if(nVal =="equipmentTypeAdd"){
				//	dataModel.mainModel.vo.parentId = data.data.id;
				//	this.mainModel.type=true;
				//}else if(nVal =="equipmentTypeUpdate"){
				//	_.deepExtend(_vo, data.data);
				//	this.mainModel.type=false;
				//}
				////行业分类
				//else  if(nVal =="industryCategoryAdd"){
				//	dataModel.mainModel.vo.parentId = data.data.id;
				//	this.mainModel.type=true;
				//}else if(nVal =="industryCategoryUpdate"){
				//	_.deepExtend(_vo, data.data);
				//	this.mainModel.type=false;
				//}
				//
				////课程类型
				//else  if(nVal =="courseCategoryAdd"){
				//	dataModel.mainModel.vo.parentId = data.data.id;
				//	this.mainModel.type=true;
				//}else if(nVal =="courseCategoryUpdate"){
				//	_.deepExtend(_vo, data.data);
				//	this.mainModel.type=false;
				//}
				//
				////取证类型
				//else  if(nVal =="certificationSubjectAdd"){
				//	dataModel.mainModel.vo.parentId = data.data.id;
				//	this.mainModel.type=true;
				//}else if(nVal =="certificationSubjectUpdate"){
				//	_.deepExtend(_vo, data.data);
				//	this.mainModel.type=false;
				//}
			},
			"ev_detailrisktypeAdd":function(val){
				var _vo = dataModel.mainModel.vo;
				//清空数据
				_.extend(_vo, newVO());
				this.mainModel.addFlag = val;
				this.mainModel.addType = true;
				this.mainModel.sort = true;
				if(this.mainModel.addFlag == "tpaEquipmentType" || this.mainModel.addFlag == "cbEquipmentType"){
					this.mainModel.requiredInform =true;
					if(this.mainModel.vo.orderNo==null){
						this.mainModel.vo.orderNo = "1";
					}
				}else{
					this.mainModel.requiredInform =false;
				}
				//如果选择的是行业分类课程分类取证类型 就直接sort赋值给orderNo
				if(val=="industryCategory"|| val=="courseCategory"|| val=="certificationSubject"){
					this.mainModel.sort = false;
				}
			}

		}
	})
	return vm;
})