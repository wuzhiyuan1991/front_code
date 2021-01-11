define(function(require){
    var LIB = require("lib");
	var customActions = {
		//信息来源隐患统计
		// poolCountByInfoSourceWithComp : {method: 'GET', url: 'rpt/stats/pool/infoSource/comp'},
		// poolCountByInfoSourceWithDep : {method: 'GET', url: 'rpt/stats/pool/infoSource/dep'},
		// poolCountDetailByInfoSourceWithComp : {method: 'GET', url: 'rpt/stats/pool/infoSource/detail/comp'},
		// poolCountDetailByInfoSourceWithDep : {method: 'GET', url: 'rpt/stats/pool/infoSource/detail/dep'},
		// queryLookUpItem : {method: 'GET', url:'lookup/fh1e8j83u8/lookupitem/fh1e8zmem2'},
		poolCountByBizType : {method: 'GET', url: 'rpt/stats/pool/bizType'},
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});