define(function(require){
    var LIB = require("lib");
	var customActions = {
        //部门积分统计
		selectRptDeptScoreData : {method: 'GET', url: 'integralscorerecord/selectRptDeptPerCapitaScoreData?type=1&orderType=DeptPerCapitaScoreScore'}
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});