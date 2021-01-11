define(function(require) {

	var LIB = require('lib');
	var template = require("text!./checkListSelectModal.html");
	var tableModel = {
		resetTriggerFlag: false,
		columns: [
			{
				fieldName:"id",
				fieldType:"radio"
			},
			{
				title: "受检对象名称",
				fieldName: "name"
			},
			{
				title: "所属机构",
				fieldType: "custom",
				render: function (data) {
					if (data.organization) {
						return data.organization.name;
					}
				}
			},
			{
				title: "负责人",
				fieldType: "custom",
				render: function (data) {
					if (data.firstUser) {
						return data.firstUser.username;
					}
				}
			},
			{
				title: "状态",
				fieldType: "custom",
				render: function (data) {
					if (data.disable == 0) {
						return "启用";
					} else if (data.disable == 1) {
						return "停用";
					}
				}
			}
		],
		url: "checkobject/list{/curPage}{/pageSize}",
		selectedDatas: [],
		filterColumn: ["criteria.strValue.name", "criteria.strValue.orgName"],
		modelModel:{
			title:"选择受检对象",
		},
	};
	var opts = {
		template: template,
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
			title:{
				type:String
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
			}
		},
		computed:{},
		methods:{
			doShowModel:function(){
				this.visible = true;
				this.resetTriggerFlag = !this.resetTriggerFlag;
			},
			//双击关闭modal
			onDbClickCell:function(){
				if(this.singleSelect){
					this.visible=false;
					this.resetTriggerFlag=!this.resetTriggerFlag;
					this.$emit('do-save',this.selectedDatas);
				}
			},
			doSave:function(){
				this.visible=false;
				this.resetTriggerFlag=!this.resetTriggerFlag;
				this.$emit('do-save',this.selectedDatas);
			}
		},
		ready:function(){
			if(this.singleSelect){
				this.isCacheSelectedData = false;
			}
		}
	}

	var component = LIB.Vue.extend(opts);
	LIB.Vue.component('checkobject-select-modal', component);
});