define(function(require){
    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		// updateDisable: {method: 'PUT', url: 'ridutyrecord/disable'},
		queryRiDutyRecordGroups: {method: 'GET', url: 'dutyrecord/personal/list{/curPage}{/pageSize}'},
		deleteRiDutyRecordGroups: _.extend({method: 'DELETE', url: 'dutyrecord'}, apiCfg.delCfg),
		
		// 值班记录
		getDutyInfoApi: {method: 'GET', url: 'dutyrecord/{id}'},
		saveDutyInfoApi: {method: 'PUT', url: 'dutyrecord'},
		selectDutyDepartApi: {method:'GET', url:'dutyrecord/{orgId}/selectDateDutyrecord'},
		createDutyInfoApi: {method: 'POST', url: 'dutyrecord'},
		getUUID: {method: 'GET', url: 'helper/getUUID'},
		
		addProductRecordApi: {method: 'POST', url: 'dutyproductionrecords'},
		editProductRecordApi: {method: 'PUT', url: 'dutyproductionrecords'},
		delProductRecordApi: {method: 'DElETE', url: 'dutyproductionrecords'},
		
		addTelFaxApi: {method: 'POST', url: 'dutycallsfaxes'},
		editTelFaxApi: {method: 'PUT', url: 'dutycallsfaxes'},
		delTelFaxApi: {method: 'DElETE', url: 'dutycallsfaxes'},
		
		addReportRecordApi: {method: 'POST', url: 'dutyvalvechamberrecord'},
		editReportRecordApi: {method: 'PUT', url: 'dutyvalvechamberrecord'},
		delReportRecordApi: {method: 'DElETE', url: 'dutyvalvechamberrecord'},
		
		dutyStatisticsApi: {method: 'GET', url: 'dutyrecord/num'},
		
		// 阀室参数记录
		veparamTableApi: {method: 'GET', url: 'dutyrecord/{id}/dutyRecordItem'},
		addVeparamApi: {method: 'POST', url: 'dutyrecorditem'},
		editVeparamApi: {method: 'PUT', url: 'dutyrecorditem'},
		delVeparamApi: {method: 'DElETE', url: 'dutyrecorditem'},
		
		// 维护检修
		maintainTableApi: {method: 'GET', url: 'dutyrecord/{id}/OpRecords'},
		addMaintainApi: {method: 'POST', url: 'dutymaintenance'},
		editMaintainApi: {method: 'PUT', url: 'dutymaintenance'},
		delMaintainApi: {method: 'DElETE', url: 'dutymaintenance'},
		
		// 工艺站场巡检
		stationInspectApi: {method: 'GET', url: 'dutyrecord/{id}/checkRecord'},
		
		// 交班内容
		shiftHandoverContentApi: {method: 'GET', url: 'dutyrecord/{id}/dutyStationYards'},
		addShiftHandoverContentApi: {method: 'POST', url: 'dutystationyard'},
		editShiftHandoverContentApi: {method: 'PUT', url: 'dutystationyard'},
		shiftHandoverRecordApi: {method: 'GET', url: 'dutyrecord/{id}/DutyHandOverRecord'},
		
		// 交班
		shiftOverAddRecordsApi: {method: 'PUT', url: 'dutyrecord/deliver'},
		shiftOverNoRecordsApi: {method: 'PUT', url: 'dutyrecord/handedClass'},
		
		// 接班
		successAgreeApi: {method: 'PUT', url: 'dutyrecord/take/agree'},
		successDisagreeApi: {method: 'PUT', url: 'dutyrecord/take/disagree'},

		// 流程图相关
		doCreateProcess: {method: 'POST', url:'dutyrecord/{id}/dutyProcessTemplate'},
        doUpdateProcess: {method: 'PUT', url:'dutyprocesstemplate'},
        doDelProcess: {method: 'DELETE', url:'dutyprocesstemplate'},
		getLastProcess: {method: 'GET', url:'dutyrecord/latest/template'},
        toGetLastProcess: {method:'PUT', url: 'dutyrecord/usePrevTpl'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("dutyrecord"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '_YYYYYYY001',
        // 'edit':   '_YYYYYYY002',
        // 'delete': '_YYYYYYY003',
        // 'import': '_YYYYYYY004',
        // 'export': '_YYYYYYY005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});