define(function(require){
    var LIB = require("lib");
	var customActions = {
		//非计划检查数倒数排名（定制报表）- 公司
		penultimateRankByComp : {method: 'GET', url: 'rpt/checkRecord/comp/penultimateRanking'},
        //非计划检查数倒数排名（定制报表）- 部门
		penultimateRankByOrg : {method: 'GET', url: 'rpt/checkRecord/org/penultimateRanking'}
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});