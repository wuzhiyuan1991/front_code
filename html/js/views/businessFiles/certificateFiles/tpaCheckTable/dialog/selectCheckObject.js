define(function(require){
	var LIB = require('lib');
 	//数据模型
	var api = require("../vuex/api");
	var tpl = require("text!./selectCheckObject.html");

	var newVO = function() {
		return {
			checkObjectId:null,
			checkTableId:null,
			objectList:[]
		}
	};

	//数据模型
	var dataModel = {
			mainModel : {
				vo : newVO()
			},
			//props:{
			//	objdata:true
			//},
			resetTriggerFlag:false,
			checkObjectColumns:[
				{
                    title:"checkbox",
                    fieldName:"id",
                    fieldType:"cb"
                },
				{
					title:"受检对象名称",
					fieldName:"name"
				},
				{
					title:"所属机构",
		            fieldType:"custom",
		            render: function(data){
		            	if(data.organization){
		            		return data.organization.name;
		            	}
		            }
				},
				{
					title:"负责人",
		        	fieldType:"custom",
		        	render: function(data){
		        		if(data.firstUser){
		            		return data.firstUser.username;
		            	}
		        	}
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
			url:"checkobject/list{/curPage}{/pageSize}",
			defaultFilterValue:{"disable":0},
			selectedDatas : [],
			filterColumn:["criteria.strValue.name", "criteria.strValue.orgName"]
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
			return dataModel
		},
		methods:{
			doSave:function(){
				this.resetTriggerFlag=!this.resetTriggerFlag;
				this.$dispatch("ev_selectObjectFinshed", dataModel.selectedDatas);
			}
		},
		events : {
			//select框数据加载
			"ev_selectObjectReload" : function(data){
        		//重置table
        		this.resetTriggerFlag=!this.resetTriggerFlag;

			}
		}
	});

	return selectDialog;
});