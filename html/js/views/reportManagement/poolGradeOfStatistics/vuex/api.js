define(function(require){
    var LIB = require("lib");
	var customActions = {
		//隐患等级隐患统计
		// poolCountByRiskTypeWithComp : {method: 'GET', url: 'rpt/stats/pool/risktype/comp'},
		// poolCountByRiskTypeWithDep : {method: 'GET', url: 'rpt/stats/pool/risktype/dep'},
		//
		// queryLookUpItem : {method: 'GET', url:'lookup/fh3tmdgrzl/lookupitem/fh3tmqpzrv'},
		poolCountByRiskLevel : {method: 'GET', url: 'rpt/stats/pool/risklevel'},
		poolCountByRiskLevelForFirstLevel : {method: 'GET', url: 'rpt/stats/pool/risklevel/firstLevel'},
		poolCountByRiskLevelForSecondLevel : {method: 'GET', url: 'rpt/stats/pool/risklevel/secondLevel'},
		poolCountAndReformCount : {method: 'GET', url: 'rpt/stats/pool/reformCount'},
};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});