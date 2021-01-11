define(function(require){
    var LIB = require("lib");
	var customActions = {
		//计划任务-实际执行-机构-日期范围-公司
		compAll : {method: 'GET', url: 'rpt/stats/checkTasks/actualExecution/comp/all'},
		//计划任务-实际执行-机构-日期范围-专业
		compSpecialty: {method: 'GET', url: 'rpt/stats/checkTasks/actualExecution/specialty/comp/all'},

		//计划任务-实际执行-机构-日期范围-部门
		depAll : {method: 'GET', url: 'rpt/stats/checkTasks/actualExecution/dep/all'},
		//计划任务-实际执行-部门-日期范围-专业
		depSpecialty: {method: 'GET', url: 'rpt/stats/checkTasks/actualExecution/specialty/dep/all'}
	};

	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});