define(function(require){
    var LIB = require("lib");
	var customActions = {
		//计划执行-工作计划-应执行计划总数-公司-公司
		compAbs : {method: 'GET', url: 'rpt/stats/checkTasks/workPlan/needToFinish/comp/all'},
		//计划执行-工作计划-应执行计划总数-公司-专业
		compSpecialty: {method: 'GET', url: 'rpt/stats/checkTasks/workPlan/needToFinish/specialty/comp/all'},

		//计划执行-工作计划-应执行计划总数-部门-公司
		depAbs : {method: 'GET', url: 'rpt/stats/checkTasks/workPlan/needToFinish/dep/all'},
		//计划执行-工作计划-应执行计划总数-部门-专业
		depSpecialty: {method: 'GET', url: 'rpt/stats/checkTasks/workPlan/needToFinish/specialty/dep/all'}
	};

	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});