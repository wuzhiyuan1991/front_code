define(function(require){
    var LIB = require("lib");
	var customActions = {
		pecapplication: {method: 'GET', url: 'pecapplication/ledgerlist'},
		/***********************************对象个体列表请求BEGIN**********************************************/
		listOrg: {method: 'GET', url: 'organization/list?disable=0'},
		listDep: {method: 'GET', url: 'rpt/setting/dep/list'},//部门列表
		listPerson: {method: 'GET', url: 'user/tree?disable=0'},
		listObj: {method: 'GET', url: 'checkobject/selectObjOrg'},
		listEquip: {method: 'GET', url: 'equipment/selectEquipOrg'},
		listTeacher: {method: 'GET', url: 'teacher/tree'},
		listCourse: {method: 'GET', url: 'course/list'}
		/***********************************对象个体列表请求END**********************************************/
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});