define(function(require){
    var LIB = require("lib");
	var customActions = {
		checkRecordCount : {method: 'GET', url: 'rpt/stats/tpa/checkrecord/car/3/org'},
        checkRecordCountByDate : {method: 'GET', url: 'rpt/stats/tpa/checkrecord/car/3/date'}
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});