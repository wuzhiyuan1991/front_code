define(function(require){
    var LIB = require("lib");
	var customActions = {
		workcardEchart: {method: 'GET', url: 'rpt/iptw/workcard/number'},
		workcardType: {method: 'GET', url: 'rpt/iptw/workcard/cataloglist'}
		
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});