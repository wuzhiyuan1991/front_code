define(function(require){
    var LIB = require("lib");
	var customActions = {
		countByUser : {method: 'GET', url: 'rpt/stats/inspection/checkRecord/illegal/user'},
};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});