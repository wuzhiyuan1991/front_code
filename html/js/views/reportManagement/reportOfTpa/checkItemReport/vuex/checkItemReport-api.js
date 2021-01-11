define(function(require){
    var LIB = require("lib");
	var customActions = {
		//检查项符合不符合排名
		recordCountByCheckItem : {method: 'GET', url: 'rpt/stats/tpa/checkitem'}
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});