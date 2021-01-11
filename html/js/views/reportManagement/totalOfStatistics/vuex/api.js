define(function(require){
    var LIB = require("lib");
	var customActions = {
		//隐患统计
		poolCountByRiskLevel : {method: 'GET', url: 'rpt/stats/pool/risklevel'},
		// poolCountByRiskLevelForFirstLevel : {method: 'GET', url: 'rpt/stats/pool/risklevel/firstLevel'},
		// poolCountByRiskLevelForSecondLevel : {method: 'GET', url: 'rpt/stats/pool/risklevel/secondLevel'},
		poolCountAndReformCount : {method: 'GET', url: 'rpt/stats/pool/reformCount'},
};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});