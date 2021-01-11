define(function(require){
    var LIB = require("lib");
	var customActions = {
		//检查表符合不符合排名
		recordCountByCheckTable : {method: 'GET', url: 'rpt/stats/pool/checktable'},
        queryDataNumLimit: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=reportFunction.dataNumLimit'}
    };
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});