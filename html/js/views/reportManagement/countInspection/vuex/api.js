define(function(require){
    var LIB = require("lib");
	var customActions = {
		countByOperationType : {method: 'GET', url: 'rpt/stats/periodicwork/riskJudge/operationType'},
		countByOperationTypeForRiskLevel : {method: 'GET', url: 'rpt/stats/periodicwork/riskJudge/operationType/riskLevel'},
		countByOperationTypeForOperationArea : {method: 'GET', url: 'rpt/stats/periodicwork/riskJudge/operationType/operationArea'},
		countAndTodo : {method: 'GET', url: 'rpt/stats/periodicwork/riskJudge/count'},

		countDominationRiskLevel:{method: 'GET', url: 'rpt/stats/periodicwork/riskJudge/domination'},
		countsupervisorsRiskJudgment:{method: 'GET', url: 'rpt/stats/periodicwork/riskJudge/supervisors'},
		countDateRiskLevel:{method: 'GET', url: 'rpt/stats/periodicwork/riskJudge/date'},

		queryInvalid: {method: 'GET', url: '/rpt/stats/checkitem/invalid/date'}
};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});