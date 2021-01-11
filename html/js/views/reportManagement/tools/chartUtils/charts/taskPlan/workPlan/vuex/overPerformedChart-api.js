define(function(require){
    var LIB = require("lib");
	var customActions = {
		//计划执行-工作计划-超期执行计划总数-公司-公司
		compAbs : {method: 'GET', url: 'rpt/stats/checkTasks/workPlan/overPerformed/comp/all'},
		//计划执行-工作计划-超期执行计划总数-公司-专业
		compSpecialty: {method: 'GET', url: 'rpt/stats/checkTasks/workPlan/overPerformed/specialty/comp/all'},

		//计划执行-工作计划-超期执行计划总数-部门-公司
		depAbs : {method: 'GET', url: 'rpt/stats/checkTasks/workPlan/overPerformed/dep/all'},
		//计划执行-工作计划-超期执行计划总数-部门-专业
		depSpecialty: {method: 'GET', url: 'rpt/stats/checkTasks/workPlan/overPerformed/specialty/dep/all'}
	};

	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});