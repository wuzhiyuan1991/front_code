define(function(require){
    var LIB = require("lib");
	var customActions = {
        checkRecordCountByBerth : {method: 'GET', url: 'rpt/stats/tpa/boat/berth'}
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});