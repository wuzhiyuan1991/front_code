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
	                url: "ptwworkisolation/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//隔离类型 1:工艺隔离,2:机械隔离,3:电气隔离,4:系统屏蔽
						title: "隔离类型",
						fieldName: "type",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_isolation_type"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_isolation_type", data.type);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_type"
					},
					{
						//解除隔离时间
						title: "解除隔离时间",
						fieldName: "disisolateTime",
						keywordFilterName: "criteria.strValue.keyWordValue_disisolateTime"
					},
					{
						title: "授权操作人员",
						fieldName: "authoriser.name",
						keywordFilterName: "criteria.strValue.keyWordValue_authoriser_name"
					},
					{
						title: "作业许可",
						fieldName: "workPermit.name",
						keywordFilterName: "criteria.strValue.keyWordValue_workPermit_name"
					},
//					{
//						//是否挂牌上锁 0:否,1:是
//						title: "是否挂牌上锁",
//						fieldName: "enableLoto",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_isolation_enable_loto"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_isolation_enable_loto", data.enableLoto);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableLoto"
//					},
//					{
//						//隔离的设备/保护的系统
//						title: "隔离的设备/保护的系统",
//						fieldName: "facility",
//						keywordFilterName: "criteria.strValue.keyWordValue_facility"
//					},
//					{
//						//隔离时间
//						title: "隔离时间",
//						fieldName: "isolateTime",
//						keywordFilterName: "criteria.strValue.keyWordValue_isolateTime"
//					},
//					{
//						//隔离点/保护的系统子件
//						title: "隔离点/保护的系统子件",
//						fieldName: "position",
//						keywordFilterName: "criteria.strValue.keyWordValue_position"
//					},
//					{
//						//状态 0:未隔离,1:已隔离,2:已解除
//						title: "状态",
//						fieldName: "status",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_isolation_status"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_isolation_status", data.status);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_status"
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
		name:"ptwworkisolationSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});