define(function(require){
    var LIB = require("lib");
	var customActions = {
        reportPoolReform : {method: 'GET', url: 'rpt/stats/tpa/pool/reform/rate'}
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});