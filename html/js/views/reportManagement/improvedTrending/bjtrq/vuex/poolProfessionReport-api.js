define(function(require){
    var LIB = require("lib");
	var customActions = {
		//专业隐患统计
		poolCountByProfession : {method: 'GET', url: 'rpt/stats/pool/profession'},
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});