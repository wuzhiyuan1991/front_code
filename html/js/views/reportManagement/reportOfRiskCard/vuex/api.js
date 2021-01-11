define(function(require){
    var LIB = require("lib");
	var customActions = {
		//隐患等级隐患统计
		riskCardRpt : {method: 'GET', url: 'rpt/riskCard'},
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});

