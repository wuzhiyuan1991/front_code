define(function(require){
    var LIB = require("lib");
	var customActions = {
		//检查对象-公司-日期范围-绝对值
		compAbs : {method: 'GET', url: 'rpt/stats/checkobj/comp/all'},
		//检查对象-公司-日期范围-平均值
		compAvg: {method: 'GET', url: 'rpt/stats/checkobj/comp/avg'},
		//检查对象-公司-日期范围-趋势
		compTrend: {method: 'GET', url: 'rpt/stats/checkobj/comp/all/trend'},

		//检查对象-部门-日期范围-绝对值
		depAbs : {method: 'GET', url: 'rpt/stats/checkobj/dep/all'},
		//检查对象-部门-日期范围-平均值
		depAvg: {method: 'GET', url: 'rpt/stats/checkobj/dep/avg'},
		//检查对象-部门-日期范围-趋势
		depTrend: {method: 'GET', url: 'rpt/stats/checkobj/dep/all/trend'},

		//检查对象-受检对象-日期范围-绝对值、平均值
		checkerAbs: {method: 'GET', url: 'rpt/stats/checkobj/checkobj/all'},
		//检查对象-受检对象-日期范围-趋势
		checkerTrend: {method: 'GET', url: 'rpt/stats/checkobj/checkobj/all/trend'}
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});