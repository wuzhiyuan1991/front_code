define(function(require){
    var LIB = require("lib");
	var customActions = {
		//体系要素隐患统计
		poolCountBySystemElementWithComp : {method: 'GET', url: 'rpt/stats/pool/problemreason/comp'},
		poolCountBySystemElementWithDep : {method: 'GET', url: 'rpt/stats/pool/problemreason/dep'},
		queryLookUpItem : {method: 'GET', url:'lookup/fh1e8j83u8/lookupitem/fh1e8zmem2'}
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});