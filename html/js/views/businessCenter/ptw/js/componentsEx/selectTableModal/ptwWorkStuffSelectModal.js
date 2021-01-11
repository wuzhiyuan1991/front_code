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
	                url: "ptwworkstuff/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//类型 1:作业工具/设备,2:作业资格证书,3:危害辨识,4:控制措施,5:工艺隔离-方法,6:个人防护设备,7:作业取消原因,8:气体检测指标
						title: "类型",
						fieldName: "stuffType",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_stuff_stuff_type"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_stuff_stuff_type", data.stuffType);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_stuffType"
					},
					{
						//现场核对结果 0:未核对,1:不勾选,2:勾选
						title: "现场核对结果",
						fieldName: "checkResult",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_stuff_check_result"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_stuff_check_result", data.checkResult);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_checkResult"
					},
					{
						title: "作业许可",
						fieldName: "workPermit.name",
						keywordFilterName: "criteria.strValue.keyWordValue_workPermit_name"
					},
					{
						title: "风险库",
						fieldName: "ptwStuff.name",
						keywordFilterName: "criteria.strValue.keyWordValue_ptwStuff_name"
					},
					{
						title: "气体类型",
						fieldName: "gasCatalog.name",
						keywordFilterName: "criteria.strValue.keyWordValue_gasCatalog_name"
					},
//					{
//						//其他的内容/资格证名称
//						title: "其他的内容/资格证名称",
//						fieldName: "content",
//						keywordFilterName: "criteria.strValue.keyWordValue_content"
//					},
//					{
//						//是否为其他 0:否,1是
//						title: "是否为其他",
//						fieldName: "isExtra",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_stuff_is_extra"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_stuff_is_extra", data.isExtra);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_isExtra"
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
		name:"ptwworkstuffSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});