define(function(require){
	var LIB = require('lib');
 	//数据模型
	var api = require("./vuex/api");
	var tpl = require("text!./convert.html");
	//弹框
	var tableComponent = require("./selectCheckObject");
	var riskModel = require("../../../basicSetting/basicFile/evaluationModel/dialog/riskModel");
	var equipmentSelectModal = require("componentsEx/selectTableModal/tpaEquipmentSelectModal");
	
	var newVO = function() {
		return {
			id :null,
			type:null,
			checkObjectId:null,
			//checkObjectName:null,
			riskLevel:null,
			riskResult:null,
			//公司id
			compId : null,
			//部門id
			orgId : null,
			riskLevel:null,//json格式
			radomObser :{},
			equipment:{id:null,name:null},
			equipmentId:null,
		}
	};
	
	//数据模型
	var dataModel = {
			mainModel : {
				vo : newVO(),
				typeList:[{id:"0",name:"行为类"},{id:"1",name:"状态类"},{id:"2",name:"管理类"}],
				checkObjectList:{},
				showEquipmentSelectModal:false,
                isReadOnly : true
			},
			//附件配置
			tableModel:{
				//显示弹框
				show : false,
				title:"选择受检对象",
				id: null
			},
			riskModel:{
		    	id:null,
		    	opts:[],
		    	result:null
		    },
			//验证规则
			rules:{
				riskResult:[{ required: true, message: '请选择风险等级'}],
    	        checkObjectId:[{ required: true, message: '请选择受检对象'}],
    	        type:[{ required: true, message: '请选择类型'}],
				compId: [
					{required: true, message: '请选择所属公司'},
				],
				orgId: [
						{required: true, message: '请选择所属部门'},
					 ],
			},
	};
	
	//声明detail组件
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
		template: tpl,
		components : {
			"tablecomponent":tableComponent,
			'riskModel':riskModel,
			"equipmentSelectModal":equipmentSelectModal,
		},
		data:function(){
			return dataModel;
		},
		methods:{
			doSave:function(){
				var _this = this;
				this.mainModel.vo.riskResult = this.riskModel.result;
				this.mainModel.vo.riskLevel = JSON.stringify(this.riskModel);
				this.$refs.ruleform.validate(function (valid){
					 if (valid) {
						api.convert(_.pick(_this.mainModel.vo,"id","type","compId","orgId","riskResult","riskLevel")).then(function(res){
							_this.$emit("do-convert-finshed");
							LIB.Msg.info("转隐患成功");
						});
					 }
				 });
			},
			doSaveEquipment:function(selectedDatas){
				if(selectedDatas){
					var equipment = selectedDatas[0];
					this.mainModel.vo.equipment.name = equipment.name;
					this.mainModel.vo.equipmentId = equipment.id;
					this.mainModel.vo.equipment.id = equipment.id;
				}
			},
			doShowEquipmentSelectModal:function(){
				this.mainModel.showEquipmentSelectModal = true;
			},
			selectCheckObject:function(){
				this.tableModel.show = true;
				this.$broadcast('ev_checkTableReload',dataModel.mainModel.vo.id);
			},
			//selectCheckTable框点击保存后事件处理
			doCheckTableFinshed:function(obj){
				this.tableModel.show = false;
				//注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
				var _data = dataModel.mainModel;
				var _vo = dataModel.mainModel.vo;
				//清空数据
				_.extend(_vo,newVO());
				//初始化数据
				_vo.radomObser = obj;
				_vo.id = obj.id;
				_vo.checkObjectId = obj.checkObjectId;
				_vo.checkObjectName = obj.checkObjectName;
			},
		},
		events : {
			//convert框数据加载
			"ev_convertReload" : function(obj){
				//清空验证
        		this.$refs.ruleform.resetFields();
                this.mainModel.isReadOnly = true;
        		//清空riskmodel
				dataModel.riskModel={};
				//注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
				var _data = dataModel.mainModel;
				var _vo = dataModel.mainModel.vo;
				//清空数据
        		//_.extend(_vo,newVO());
				_.deepExtend(_vo, obj);
        		//初始化数据
        		//_vo.id = obj.id;
        		//_vo.checkObjectId = obj.checkObjectId;
        		//if(obj.checkObject){
        		//	_vo.checkObjectName = obj.checkObject.name;
        		//}
        		//初始化
        		this.riskModel.id = null;
        		this.riskModel.opts = new Array();
        		this.riskModel.result = null;
			},
			//selectCheckTable框点击保存后事件处理
			//"ev_checkTableFinshed" : function(obj) {
			//	this.tableModel.show = false;
			//	//注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
			//	var _data = dataModel.mainModel;
			//	var _vo = dataModel.mainModel.vo;
			//	//清空数据
        		//_.extend(_vo,newVO());
        		//
        		////初始化数据
        		//_vo.radomObser = obj;
        		//_vo.id = obj.id;
        		//_vo.checkObjectId = obj.checkObjectId;
        		//_vo.checkObjectName = obj.checkObjectName;
			//},
			//selectCheckTable框点击取消后事件处理
			//"ev_checkTableCanceled" : function() {
			//	this.tableModel.show = false;
			//}
		}
	});
	
	return detail;
});