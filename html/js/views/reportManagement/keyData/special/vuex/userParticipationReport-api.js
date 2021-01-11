define(function(require){
    var LIB = require("lib");
	var customActions = {
		//员工参与度（定制报表）- 公司
		userParticipationByComp : {method: 'GET', url: 'rpt/radomObser/comp/userParticipation'},
        //员工参与度（定制报表）- 部门
		userParticipationByOrg : {method: 'GET', url: 'rpt/radomObser/org/userParticipation'},
		checkTimeAbs: {method: 'GET', url: 'rpt/stats/keypost/comp/all'},
        checkTimeAvg: {method: 'GET', url: 'rpt/stats/keypost/comp/avg'},
        checkTimeTrend: {method: 'GET', url: 'rpt/stats/keypost/comp/all/trend'},
        issueAbs: {method: 'GET', url: 'rpt/stats/keypost/hiddenDanger/comp/all'},
        issueAvg: {method: 'GET', url: 'rpt/stats/keypost/hiddenDanger/comp/avg'},
        issueTrend: {method: 'GET', url: 'rpt/stats/keypost/hiddenDanger/comp/all/trend'}

    };
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});