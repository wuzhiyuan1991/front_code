define(function(require){
    var LIB = require("lib");
	var customActions = {
		//检查项符合不符合排名
		recordCountByCheckItem : {method: 'GET', url: 'rpt/stats/pool/checkitem'},
        queryDataNumLimit: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=reportFunction.dataNumLimit'}
    };
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});