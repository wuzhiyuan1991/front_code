define(function(require){
    var LIB = require("lib");
	var customActions = {
		/***********************************对象个体列表请求BEGIN**********************************************/
		save: {method: 'POST', url: 'rpt/setting'},
		update: {method: 'PUT', url: 'rpt/setting'},
		saveBatchOrderNum:{method: 'POST', url: 'rpt/setting/updateOrderNum/batch'},
		get: {method: 'GET', url: 'rpt/setting/{id}'},
		list:{method: 'GET', url: 'rpt/setting/list/{homeType}'},
		delByIds:{method: 'DELETE', url: 'rpt/setting'},
		setHome: {method: 'PUT', url: 'rpt/setting/setHome/{id}'},
		setHomeOfCommon: {method: 'PUT', url: 'rpt/setting/setHome/common/{state}'},
		setHomeOfCover: {method: 'PUT', url: 'rpt/setting/setHome/cover'},
		homeList: {method: 'GET', url: 'rpt/setting/home/list'},
        queryDataNumLimit: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=reportFunction.dataNumLimit'},
		queryTaskStatus:{method: 'GET', url: 'rpt/stats/taskstatus/cache'},
		refreshTaskStatus:{method: 'GET', url: 'rpt/stats/taskstatus/refresh'},
		querySelfInspectionRate:{method: 'GET', url: 'rpt/stats/pool/selfinspectionrate'},
        /***********************************对象个体列表请求END**********************************************/
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});