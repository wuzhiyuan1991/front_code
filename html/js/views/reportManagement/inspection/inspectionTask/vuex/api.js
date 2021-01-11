define(function(require){
    var LIB = require("lib");
	var customActions = {
		countByTableType : {method: 'GET', url: 'rpt/stats/inspection/task/tableType'},
		countByTask : {method: 'GET', url: 'rpt/stats/inspection/task/finishInfo'},
		countByCompletion : {method: 'GET', url: 'rpt/stats/inspection/task/completion'},
		countByUserCompletion : {method: 'GET', url: 'rpt/stats/inspection/task/user/completion'},
		countByUser : {method: 'GET', url: 'rpt/stats/inspection/task/user'},
		// countByOperationTypeForOperationArea : {method: 'GET', url: 'rpt/stats/periodicwork/riskJudge/operationType/operationArea'},
		// countAndTodo : {method: 'GET', url: 'rpt/stats/periodicwork/riskJudge/count'},
};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});