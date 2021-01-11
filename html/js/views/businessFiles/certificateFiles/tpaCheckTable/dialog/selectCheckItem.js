define(function(require){
	var LIB = require('lib');
 	//数据模型
	var api = require("../vuex/api");
	var tpl = require("text!./selectCheckItem.html");
	
	var newVO = function() {
		return {
			id:null,
			itemOrderNo:null,
			groupOrderNo:null,
			groupName:null,
			checkItemId:null,
			checkTableId:null,
			itemList:[],
			checkItemList:[],//已经关联的检查项集合
			tirId:null//edit页面传过来的，保存分组信息，如果edit页面没有任何检查项，当前页面需删除后再关联checkItem
		}
	};

	//数据模型
	var dataModel = {
			mainModel : {
				vo : newVO()
			},
			resetTriggerFlag:false,
			checkItemColumns:[
				{
                    title:"checkbox",
                    fieldName:"id",
                    fieldType:"cb"
                },
				{
					title:"检查项名称",
					fieldName:"name",
				},
				{
					title:"分类",
		            fieldType:"custom",
		            render: function(data){
		            	if(data.riskType){
		            		return data.riskType.name;
		            	}
		            }
				},
				{
					title:"类型",
		        	fieldType:"custom",
		        	render: function(data){
		        		if(data.type == 2){
		        			return "管理类";
		        		}else if(data.type == 1){
	        				return "状态类";
		        		}else if(data.type == 0){
		        			return "行为类";
		        		}
		        	}
				},
				{
					title:"设备设施",
		        	fieldType:"custom",
					render: function(data){
						return data.tpaEquipment == null ? "" : data.tpaEquipment.name;
		        	}
				}
			],
			url:"tpacheckitem/list{/curPage}{/pageSize}",
			defaultFilterValue:{"disable":0,"criteria.intsValue.itemType":[30]},
			selectedDatas : [],
			filterColumn:["criteria.strValue.name", "criteria.strValue.risktypename"]
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
	var selectDialog = LIB.Vue.extend({
		template: tpl,
		data:function(){
			return dataModel;
		},
		methods:{
			doSave:function(){
				this.$dispatch("ev_selectItemFinshed",dataModel);
			}


		},
		events : {
			//select框数据加载
			"ev_selectItemReload" : function(checkTable,tir){
				//注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
				var _data = dataModel.mainModel;
				var _vo = dataModel.mainModel.vo;
				//清空数据
        		_.extend(_vo,newVO());
        		
        		//初始化数据
        		if(tir){
        			_.deepExtend(_vo, tir);
        			//_vo.group = tir;
        		}
        		//赋值
        		_vo.tirId = tir.id;
        		_vo.itemList = tir.itemList;
        		_vo.checkTableId = checkTable.id;
        		_vo.checkItemList = checkTable.checkItemList;
        		
        		//重置table
        		this.resetTriggerFlag=!this.resetTriggerFlag;
			}
		}
	});
	
	return selectDialog;
});