define(function(require){
    var LIB = require("lib");
	var customActions = {
		//检查表 不符合率 排名（定制报表）- 公司
		unqualifiedRateByComp : {method: 'GET', url: 'rpt/checkRecord/comp/unqualifiedRate'},
        //检查表 不符合率 排名（定制报表）- 部门
		unqualifiedRateByOrg : {method: 'GET', url: 'rpt/checkRecord/org/unqualifiedRate'},
        queryDataNumLimit: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=reportFunction.dataNumLimit'}

    };
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});