define(function(require){
    var LIB = require("lib");
	var customActions = {
		//隐患等级隐患统计
		poolCountByRiskType : {method: 'GET', url: 'rpt/stats/pool/risktype'},
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});