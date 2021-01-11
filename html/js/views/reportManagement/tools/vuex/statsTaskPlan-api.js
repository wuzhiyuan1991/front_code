/**
 * 计划任务报表api相关接口
 */
define(function(require){
    var LIB = require("lib");
	var customActions = {
		//计划执行-工作计划-应执行计划总数-公司部门-日期范围-公司
		orgAbs : {method: 'GET', url: 'rpt/stats/checker/org/all'},
		//计划执行-工作计划-应执行计划总数-公司部门-日期范围-专业
		orgAvg: {method: 'GET', url: 'rpt/stats/checker/org/avg'},
		//
		orgTrend: {method: 'GET', url: 'rpt/stats/checker/org/all/trend'},
		//检查人-人员-日期范围-绝对值、平均值
		checkerAbs: {method: 'GET', url: 'rpt/stats/checker/checker/all'},
		//检查人-人员-日期范围-趋势
		checkerTrend: {method: 'GET', url: 'rpt/stats/checker/checker/all/trend'}
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});