define(function(require){
    var LIB = require("lib");
	var customActions = {
        checkRecordCount : {method: 'GET', url: 'rpt/stats/tpa/checkrecord/1/org'},
        checkRecordCountByDate : {method: 'GET', url: 'rpt/stats/tpa/checkrecord/1/date'}
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});