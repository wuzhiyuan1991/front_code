//define(function(require) {
//
//	var LIB = require('lib');
//	var template = '<iv-input display-type="popselect" :value.sync="dataModel"  @click="doShowModel"  readonly></iv-input>'+
//					'<user-select-modal :visible.sync="visible"  ' +
//					' :selected-datas.sync="selectedDatas" ' +
//						' @do-save="doSelecteUser" ' +
//						':single-select="singleSelect"' +
//						':is-cache-selected-data="isCacheSelectedData">' +
//						'</user-select-modal>'
//	var tableModel = {
//		resetTriggerFlag:false,
//		columns:[
//			{
//				fieldType: "cb"
//			},
//			{
//				title:"姓名",
//				fieldName:"username"
//			},
//			{
//				title:"所属机构",
//				fieldType:"custom",
//				render: function(data){
//					if(data.org){
//						return data.org.name;
//					}
//				}
//			},
//			{
//				title:"岗位",
//				fieldType:"custom",
//				render: function(data){
//					if(data.positionList){
//						var pos = "";
//						data.positionList.forEach(function(e){
//							pos = pos+"  "+e.name;
//						});
//						return pos;
//					}
//				}
//			},
//			{
//				title:"上级领导",
//				fieldType:"custom",
//				render: function(data){
//					if(data.leader){
//						return data.leader.username;
//					}
//				}
//			},
//			{
//				title:"手机",
//				fieldName:"mobile"
//			},
//			{
//				title:"状态",
//				fieldType:"custom",
//				render: function(data){
//					if(data.disable == 1){
//						return "离职";
//					}
//					else if(data.disable == 0){
//						return "在职";
//					}
//				}
//			},
//		],
//		url:"user/list{/curPage}{/pageSize}",
//		selectedDatas : [],
//		filterColumn:["criteria.strValue.username", "criteria.strValue.mobile"],
//		modelModel:{
//			show:false,
//			title:"选择人员",
//			id: null
//		},
//
//	};
//	var opts = {
//		template: template,
//		data:function(){
//			var checkColumnOpt = tableModel.columns[0];
//			checkColumnOpt.fieldType = !this.singleSelect ? "cb" : "radio";
//			return tableModel;
//		},
//		props: {
//			showModelTable:{
//				type: Boolean,
//				default: false
//			},
//			//单选跟多选
//			singleSelect:{
//				type: Boolean,
//				default:false
//			},
//			visible:{
//				type: Boolean,
//				default:false
//			},
//			dataModel:{
//				type:String,
//			},
//			isCacheSelectedData:{
//				type: Boolean,
//				default:true
//			}
//
//		},
//		methods:{
//			doShowModel:function(){
//				this.visible = true;
//				this.resetTriggerFlag = !this.resetTriggerFlag;
//			},
//			doSelecteUser:function(){
//				this.visible = false;
//				this.resetTriggerFlag = !this.resetTriggerFlag;
//				this.$emit('do-save',this.selectedDatas);
//			},
//			doClose:function(){
//				this.resetTriggerFlag = !this.resetTriggerFlag;
//			}
//		},
//		ready:function(){
//			if(this.singleSelect){
//				this.isCacheSelectedData = false;
//			}
//		}
//	}
//
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('user-select', component);
//});

define(function(require) {

	var LIB = require('lib');
	//弹窗选人
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var template = '<iv-input display-type="popselect" :value.sync="dataModel"  @click="doShowModel" '+
	'readonly></iv-input>'+
		'<user-select-modal :visible.sync="visible"  ' +
		' @do-save="doSelecteUser" ' +
		':single-select="singleSelect"' +
		':is-cache-selected-data="isCacheSelectedData"' +
		'>' +
		'</user-select-modal>'
	var tableModel = {
		resetTriggerFlag:false,
		columns:[
			{
				fieldType: "cb"
			},
			{
				title:"姓名",
				fieldName:"username"
			},
			{
				title:"所属机构",
				fieldType:"custom",
				render: function(data){
					if(data.org){
						return data.org.name;
					}
				}
			},
			{
				title:"岗位",
				fieldType:"custom",
				render: function(data){
					if(data.positionList){
						var pos = "";
						data.positionList.forEach(function(e){
							pos = pos+"  "+e.name;
						});
						return pos;
					}
				}
			},
			{
				title:"上级领导",
				fieldType:"custom",
				render: function(data){
					if(data.leader){
						return data.leader.username;
					}
				}
			},
			{
				title:"手机",
				fieldName:"mobile"
			},
			{
				title:"状态",
				fieldType:"custom",
				render: function(data){
					if(data.disable == 1){
						return "离职";
					}
					else if(data.disable == 0){
						return "在职";
					}
				}
			},
		],
		url:"user/list{/curPage}{/pageSize}",
		selectedDatas : [],
		filterColumn:["criteria.strValue.code","criteria.strValue.mobile","criteria.strValue.email","criteria.strValue.faceFlag","criteria.strValue.faceid","criteria.strValue.keysata","criteria.strValue.lastLoginImei","criteria.strValue.lastLoginIp","criteria.strValue.lastLoginQth","criteria.strValue.loginName","criteria.strValue.mobile2","criteria.strValue.nickname","criteria.strValue.password","criteria.strValue.remarks","criteria.strValue.username"],
		defaultFilterValue : {"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"}},
	};

	var opts = {
		template: template,
		components : {
			"userSelectModal":userSelectModal
		},
		data:function(){
			var checkColumnOpt = tableModel.columns[0];
			checkColumnOpt.fieldType = !this.singleSelect ? "cb" : "radio";
			return tableModel;
		},
		props: {
			showModelTable:{
				type: Boolean,
				default: false
			},
			//单选跟多选
			singleSelect:{
				type: Boolean,
				default:false
			},
			visible:{
				type: Boolean,
				default:false
			},
			dataModel:{
				type:String,
			},
			isCacheSelectedData:{
				type: Boolean,
				default:true
			},

		},
		watch:{
			visible : function() {
			},
		},
		methods:{
			doShowModel:function(){
				this.visible = true;
				this.resetTriggerFlag = !this.resetTriggerFlag;
			},
			doSelecteUser:function(obj){
				this.visible = false;
				this.resetTriggerFlag = !this.resetTriggerFlag;
				this.$emit('do-save',obj);
			},
			doClose:function(){
				this.resetTriggerFlag = !this.resetTriggerFlag;
			}
		},
		ready:function(){
			if(this.singleSelect){
				this.isCacheSelectedData = false;
			}
		}
	}

	var component = LIB.Vue.extend(opts);
	return component;
});