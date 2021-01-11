define(function(require){
	var LIB = require('lib');
 	//数据模型
	var api = require("./vuex/api");
	var tpl = require("text!./selectCheckObject.html");
	
	var newVO = function() {
		return {
			id:null,
			checkObjectId:null,
			checkObjectName:null
		}
	};

	//数据模型
	var dataModel = {
			mainModel : {
				vo : newVO()
			},
			resetTriggerFlag:false,
			checkObjectColumns:[
				{
                    title:"",
                    fieldName:"id",
                    fieldType:"radio"
                },
				{
					title:"受检对象名称",
					fieldName:"name"
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
					title:"组织机构",
		        	fieldType:"custom",
		        	render: function(data){
		            	if(data.organization){
		            		return data.organization.name;
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
			return dataModel;
		},
		methods:{
			doSave:function(){
				var _this = this;
				if(dataModel.selectedDatas){
					dataModel.mainModel.vo.checkObjectId= dataModel.selectedDatas[0].id;
					dataModel.mainModel.vo.checkObjectName= dataModel.selectedDatas[0].name;
					//_this.$dispatch("ev_checkTableFinshed",dataModel.mainModel.vo);
					_this.$emit("do-check-table-finshed",dataModel.mainModel.vo);
					//var callback = function(res){
					//	_this.$dispatch("ev_checkTableFinshed",dataModel.mainModel.vo);
					//}
					//api.update(_.pick(this.mainModel.vo,"id","checkObjectId")).then(callback);
				}
			},
			//双击关闭modal
			onDbClickCell:function(){
					this.doSave();
			},
			//doCancel:function(){
			//	this.$dispatch("ev_checkTableCanceled");
			//}
		},
		events : {
			//select框数据加载
			"ev_checkTableReload" : function(nVal){
				//注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
				var _vo = dataModel.mainModel.vo;
				//清空数据
        		_.extend(_vo,newVO());

        		//初始化数据
        		_vo.id = nVal;

        		//重置table
        		this.resetTriggerFlag=!this.resetTriggerFlag;
			}
		}
	});
	
	return selectDialog;
});