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
	                url: "pecposition/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//级别 1:站队级,2:管理处级,3:公司级
						title: "级别",
						fieldName: "level",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("ipec_position_level"),
						render: function (data) {
							return LIB.getDataDic("ipec_position_level", data.level);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_level"
					},
					{
						//岗位 1:基层站队长,2:管理处机关业务人员,3:管理处机关科室长,4:管理处机关主管领导,5:公司业务处室业务人员,6:公司业务处室科室长,7:公司业务处室主管领导
						title: "岗位",
						fieldName: "type",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("ipec_position_type"),
						render: function (data) {
							return LIB.getDataDic("ipec_position_type", data.type);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_type"
					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remarks",
//						keywordFilterName: "criteria.strValue.keyWordValue_remarks"
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
		name:"pecpositionSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});