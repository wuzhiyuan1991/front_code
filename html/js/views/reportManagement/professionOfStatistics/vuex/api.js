define(function(require){
    var LIB = require("lib");
	var customActions = {
		//专业隐患统计
		poolCountByProfessionWithComp : {method: 'GET', url: 'rpt/stats/pool/profession/comp'},
		poolCountByProfessionWithDep : {method: 'GET', url: 'rpt/stats/pool/profession/dep'},
		queryLookUpItem : {method: 'GET', url:'lookup/fh1dmaom93/lookupitem/fh1dmjh3rt'}
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});