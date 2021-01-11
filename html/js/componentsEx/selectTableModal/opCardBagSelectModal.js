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
	                url: "opcardbag/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//文件夹名
						title: "文件夹名",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name",
					},
					{
						//序号
						title: "序号",
						fieldName: "orderNo",
						keywordFilterName: "criteria.strValue.keyWordValue_orderNo",
					},
					{
						title: "卡票",
						fieldName: "opCard.name",
						keywordFilterName: "criteria.strValue.keyWordValue_opCard_name"
					},
//					{
//						//类型 1:文件夹,2:卡票
//						title: "类型",
//						fieldName: "type",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("jse_op_card_bag_type"),
//						render: function (data) {
//							return LIB.getDataDic("jse_op_card_bag_type", data.type);
//						}
//						keywordFilterName: "criteria.strValue.keyWordValue_type",
//					},
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
		name:"opCardBagSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});