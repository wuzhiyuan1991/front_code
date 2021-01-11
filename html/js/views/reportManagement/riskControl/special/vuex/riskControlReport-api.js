define(function(require){
    var LIB = require("lib");
	var customActions = {
		//风险管控（定制报表）- 公司
		statisticsOfRiskControlByComp : {method: 'GET', url: 'rpt/checkTable/comp/riskControl'},
        //风险管控（定制报表）- 部门
		statisticsOfRiskControlByOrg : {method: 'GET', url: 'rpt/checkTable/org/riskControl'},
		// 查询 风险管控（定制报表）-撰取报表、查询检查项合格率- 公司
		getCompCheckItemPercent: {method: 'GET', url: 'rpt/checkTable/comp/riskControl/checkItemDetail'},
		// 查询 风险管控（定制报表）-撰取报表、查询检查项合格率- 部门
        getOrgCheckItemPercent: {method: 'GET', url: 'rpt/checkTable/org/riskControl/checkItemDetail'}
    };
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});