define(function(require) {

	var LIB = require('lib');
	
	var initDataModel = function () {
        return {
        	mainModel:{
				title:"选择",
				selectedDatas:[]
			},
            tableModel: (
	            {
	                url: "ptwcardstuff/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//类型 1:作业工具/设备,2:作业资格证书,3:危害辨识,4:控制措施,5:工艺隔离-方法,6:个人防护设备,7:作业取消原因
						title: "类型",
						fieldName: "stuffType",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_card_stuff_stuff_type"),
						render: function (data) {
							return LIB.getDataDic("iptw_card_stuff_stuff_type", data.stuffType);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_stuffType"
					},
					{
						title: "基础库",
						fieldName: "ptwStuff.name",
						keywordFilterName: "criteria.strValue.keyWordValue_ptwStuff_name"
					},
					{
						title: "作业票模板",
						fieldName: "ptwCardTpl.name",
						keywordFilterName: "criteria.strValue.keyWordValue_ptwCardTpl_name"
					},
//					 LIB.tableMgr.ksColumn.modifyDate,
////					 LIB.tableMgr.ksColumn.createDate,
//
	                ],

	                defaultFilterValue : {
	                	"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"},
						"disable" : 0
	                },
	                resetTriggerFlag:false
	            }
            )
        };
    }
	
	var opts = {
		mixins : [LIB.VueMixin.selectorTableModal],
		data:function(){
			var data = initDataModel();
			return data;
		},
		name:"ptwcardstuffSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});