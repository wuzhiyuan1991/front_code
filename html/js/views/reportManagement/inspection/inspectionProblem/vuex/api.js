define(function(require){
    var LIB = require("lib");
	var customActions = {
		countByUser : {method: 'GET', url: 'rpt/stats/inspection/problem/user'},
		countByUserRatio : {method: 'GET', url: 'rpt/stats/inspection/problem/userRatio'},
		countBySpeciality : {method: 'GET', url: 'rpt/stats/inspection/problem/speciality'},
		countByEquipment : {method: 'GET', url: 'rpt/stats/inspection/problem/equipment'},
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});