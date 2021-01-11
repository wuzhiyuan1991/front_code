define(function(require) {

	var LIB = require('lib');
	var template = require("text!./checkListSelectModal.html");
	var tableModel = {
		resetTriggerFlag:false,
		columns:[
			{
				title:"",
				fieldName:"id",
				fieldType:"radio"
			},
			{
				title:"检查表名称",
				fieldName:"name"
			},
			{
				title:"分类",
				fieldType:"custom",
				render: function(data){
					if(data.checkTableType){
						return data.checkTableType.name;
					}
				}
			},
			{
				title:"类型",
				fieldType:"custom",
				render: function(data){
					if(data.type == 1){
						return "计划检查";
					}else if(data.type == 0){
						return "日常检查";
					}
				}
			},
			{
				title:"创建时间",
				fieldName:"createDate"
			},
			{
				title:"状态",
				fieldType:"custom",
				render: function(data){
					if(data.disable == 0){
						return "启用";
					}else if(data.disable == 1){
						return "停用";
					}
				}
			}
		],
		url:"checktable/list{/curPage}{/pageSize}",
		selectedDatas : [],
		filterColumn:["criteria.strValue.name", "criteria.strValue.checkTableTypeName"],
		modelModel:{
			title:"选择检查表",
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
            disabled:{
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
			},
            //自定义初始化过滤条件
            defaultFilterValue : {
                type: Object,
            },
		},
		methods:{
			doShowModel:function(){
				if (this.disabled==false){
                    this.visible = true;
                    this.resetTriggerFlag = !this.resetTriggerFlag;
				}
			},
			//双击关闭modal
			onDbClickCell:function(){
				//tableModel.columns[0].fieldType =="radio"
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
	LIB.Vue.component('checklist-select-modal', component);
});