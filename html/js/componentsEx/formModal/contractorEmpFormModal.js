define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./contractorEmpFormModal.html");
	var api = require("views/businessFiles/ptw/contractor/vuex/api");
	var contractorSelectModal = require("componentsEx/selectTableModal/contractorSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//姓名
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			certRel:[],
			//备注
			remark : null,
			//联系电话
			telephone : null,
			//工种
			workTypes:[],
			workTypesRel:[],
			userDetail: {
				id : null,
				//年龄
				age : null,
				//性别
				sex : '1',
				//身份证号
				idcard : null,
			},
			//承包商
			contractor : {id:'', name:''},
			loginName:null
		}
	};

	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'create',
			isReadOnly : false,
			title:"添加",

			//验证规则
	        rules:{
				"code" : [LIB.formRuleMgr.length(100)],
				"name" : [LIB.formRuleMgr.length(100),LIB.formRuleMgr.require("姓名")],
				"disable" :LIB.formRuleMgr.require("状态"),
				"userDetail.age" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"userDetail.idcard" : [LIB.formRuleMgr.length(100)],
				"remark" : [LIB.formRuleMgr.length(500)],
				"userDetail.sex" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"telephone" : [LIB.formRuleMgr.length(100)],
				"workType" : [LIB.formRuleMgr.require("工种")],
				"contractor.id" : [LIB.formRuleMgr.allowStrEmpty],
				"loginName": [
					LIB.formRuleMgr.length(50, 1)
				]
	        },
	        emptyRules:{}
		},
		selectModel : {
			contractorSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"contractorSelectModal":contractorSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowContractorSelectModal : function() {
				this.selectModel.contractorSelectModel.visible = true;
				//this.selectModel.contractorSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveContractor : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.contractor = selectedDatas[0];
				}
			},
			doSaveEmp:function(){
				var _this = this;
				if(_this.mainModel.vo.telephone || _this.mainModel.vo.loginName){
					api.verifyTelephoneOrLoginName({telephone:_this.mainModel.vo.telephone,loginName:_this.mainModel.vo.loginName,id:_this.mainModel.vo.id}).then(function(res){
						// if(res.data){
							// LIB.Msg.error(res.data);
						// }else{
							_this.doSave();
						// }
					})
				}
				else{
					_this.doSave();
				}

			},
			beforeDoSave:function(){
				var _this = this;
				if(!this.mainModel.vo.id){
                    this.mainModel.vo.certRel = [];
				}

				// this.mainModel.vo.certificates.forEach(function(item){
				// 	_this.mainModel.vo.certRel.push({
				// 		lookUpValue : item,
				// 		type:1
				// 	})
				// });
				this.mainModel.vo.workTypeRel = [];
				this.mainModel.vo.workTypes.forEach(function(item){
					_this.mainModel.vo.workTypeRel.push({
						lookUpValue : item,
						type:2
					})
				})
			},
			afterInitData:function(){
				var _this = this;
				this.mainModel.vo.certificates = [];
				this.mainModel.vo.certRel.forEach(function(item){

					_this.mainModel.vo.certificates.push(item.lookUpValue);
				});
				_this.mainModel.vo.certificates = _.uniq(_this.mainModel.vo.certificates);
				this.mainModel.vo.workTypes = [];
				this.mainModel.vo.workTypeRel.forEach(function(item){
					_this.mainModel.vo.workTypes.push(item.lookUpValue);
				});
				_this.mainModel.vo.workTypes = _.uniq(_this.mainModel.vo.workTypes);
			}
		}
	});
	
	return detail;
});