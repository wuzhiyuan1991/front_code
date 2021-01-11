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
	                url: "pecauditrole/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
					{
						//级别 1:站队级,2:管理处级,3:公司级
						title: "级别",
						fieldName: "positionLevel",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("ipec_audit_role_position_level"),
						render: function (data) {
							return LIB.getDataDic("ipec_audit_role_position_level", data.positionLevel);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_positionLevel"
					},
					{
						title: "人员",
						fieldName: "user.name",
						keywordFilterName: "criteria.strValue.keyWordValue_user_name"
					},
//					{
//						//岗位 1:基层站队长,2:管理处机关业务人员,3:管理处机关科室长,4:管理处机关主管领导,5:公司业务处室业务人员,6:公司业务处室科室长,7:公司业务处室主管领导
//						title: "岗位",
//						fieldName: "positionType",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("ipec_audit_role_position_type"),
//						render: function (data) {
//							return LIB.getDataDic("ipec_audit_role_position_type", data.positionType);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_positionType"
//					},
//					{
//						//审批形式 1:按站队,2:按公司,3:按专业
//						title: "审批形式",
//						fieldName: "relType",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("ipec_audit_role_rel_type"),
//						render: function (data) {
//							return LIB.getDataDic("ipec_audit_role_rel_type", data.relType);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_relType"
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
		name:"pecauditroleSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});