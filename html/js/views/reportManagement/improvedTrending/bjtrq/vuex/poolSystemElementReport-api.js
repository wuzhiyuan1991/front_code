define(function(require){
    var LIB = require("lib");
	var customActions = {
		//体系要素隐患统计
		poolCountBySystemElement : {method: 'GET', url: 'rpt/stats/pool/systemelement'},
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});