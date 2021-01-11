define(function(require){
    var LIB = require("lib");
	var customActions = {
		//隐患等级隐患统计
		poolCountByRiskLevel : {method: 'GET', url: 'rpt/stats/pool/risklevel'},

		// queryLookUpItem : {method: 'GET', url:'lookup/fh3tmdgrzl/lookupitem/fh3tmqpzrv'}
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});