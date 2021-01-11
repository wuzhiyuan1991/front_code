define(function(require){
    var LIB = require("lib");
	var customActions = {
		//检查人-公司-日期范围-绝对值
		compAbs : {method: 'GET', url: 'rpt/stats/checker/comp/all'},
		//检查人-公司-日期范围-平均值
		compAvg: {method: 'GET', url: 'rpt/stats/checker/comp/avg'},
		//检查人-公司-日期范围-趋势
		compTrend: {method: 'GET', url: 'rpt/stats/checker/comp/all/trend'},


		//检查人-部门-日期范围-绝对值
		depAbs : {method: 'GET', url: 'rpt/stats/checker/dep/all'},
		//检查人-部门-日期范围-平均值
		depAvg: {method: 'GET', url: 'rpt/stats/checker/dep/avg'},
		//检查人-部门-日期范围-趋势
		depTrend: {method: 'GET', url: 'rpt/stats/checker/dep/all/trend'},


		//检查人-人员-日期范围-绝对值、平均值
		checkerAbs: {method: 'POST', url: 'rpt/stats/checker/checker/all'},
		//检查人-人员-日期范围-趋势
		checkerTrend: {method: 'POST', url: 'rpt/stats/checker/checker/all/trend'}
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});