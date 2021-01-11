define(function(require){
    var LIB = require("lib");
	var customActions = {
		//信息来源隐患统计
		poolCountByInfoSource : {method: 'GET', url: 'rpt/stats/pool/infoSource'},
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});