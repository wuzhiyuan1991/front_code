define(function(require){
    var LIB = require("lib");
	var customActions = {
		countByRiskLevel : {method: 'GET', url: '/rpt/stats/riskAssessment/riskIdentification/riskLevel'},
		countByImplement : {method: 'GET', url: '/rpt/stats/riskAssessment/riskIdentification/implement'},
		countBySpecialty : {method: 'GET', url: '/rpt/stats/riskAssessment/riskIdentification/specialty'},
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});