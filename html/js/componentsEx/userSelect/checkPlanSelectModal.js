define(function(require) {

	var LIB = require('lib');
	var template = require("text!./checkPlanSelectModal.html");
	var tableModel = {
		resetTriggerFlag:false,
		columns:[{
				title : "",
				fieldName : "id",
				fieldType : "cb",
			}, {
				title : "检查计划名称",
				orderName : "name",
				fieldName : "name",
				filterType : "text"
			}, {
				title : "开始时间",
				fieldName : "startDate"
			}, {
				title : "结束时间",
				fieldName : "endDate"
			}, {
				title : "检查表",
				orderName:"checktable.name",
				fieldType:"custom",
				render: function(data){
					if(data.checkTable){
						return data.checkTable.name;
					}
				},
				filterType : "text",
				filterName : "criteria.strValue.checktableName"
			}, {
				title : "状态",
				orderName : "disable",
				fieldType:"custom",
				render: function(data){
					return LIB.getDataDic("isPublished",data.disable);
				},
				popFilterEnum : LIB.getDataDicList("isPublished"),
				filterType : "enum",
				filterName : "criteria.intsValue.disable"
			}],
			url : "checkplan/list{/curPage}{/pageSize}",
        	filterColumn:["criteria.strValue.checktableName", "criteria.strValue.name"],
			selectedDatas:[],
			modelModel:{
			title:"选择检查计划",
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
			visible:{
				type: Boolean,
				default:false
			},
			columns:{
				type: Array,
				default: function(){
					return tableModel.columns
				}
			},
			dataModel:{
				type:String,
			},
            //自定义初始化过滤条件
            defaultFilterValue : {
                type: Object
            },
			isCacheSelectedData:{
				type: Boolean,
				default:true
			}
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
	LIB.Vue.component('checkplan-select-modal', component);
});