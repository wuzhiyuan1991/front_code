define(function(require){

    var Vue = require("vue");
	var apiCfg = require("apiCfg");
	
	var customActions = {
        disable : {method: 'POST', url: 'riskmodel/disable'},
		selectIsDataReferenced : {method: 'GET', url:'riskmodel/selectIsDataReferenced/{id}'},
        enable : {method: 'POST', url: 'riskmodel/enable'},
	    //deleteByIds: {method: 'delete', url: 'riskmodel'},
		updateRule: {method: 'PUT', url: 'riskmodel/updateRule'},
	    //获取组织机构
	    //listOrg:{method:'GET', url:'organization/list'},
	    //获取评定纬度列表
	    listGradeLat:{method: 'GET', url: 'riskmodel/gradelat/list'},
	    //获取评定纬度详情
	    getGradeLat:{method: 'GET', url: 'riskmodel/gradelat/{id}'},
	    //保存评定纬度详情
	    saveGradeLat:{method: 'POST', url: 'riskmodel/gradelat'},
	    //获取模型结果集范围列表
	    listGradeLatRange:{method: 'GET', url: 'riskmodel/graderange/list'},
	    saveGradeLatRange:{method: 'POST', url: 'riskmodel/graderange/batchUpdate'},
		copyRiskModel:{method: 'POST', url: 'riskmodel/copyRiskModel'},
        queryHistoryRiskModel : {method: 'GET', url:'riskmodel/comp'},
        updateReferencedRiskModel : {method:'PUT',url:'riskmodelconf/{id}/updateReferencedRiskModel'},

		getCount: {method: "GET", url: "riskmodel/count/list"}
		//初始化组织机构
		//listOrganization:{method: 'GET', url: 'organization/list'},

	};
	customActions = _.defaults(customActions, apiCfg.buildDefaultApi("riskmodel"));
	
	var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '3020001001',
        'edit': '3020001002',
        'delete': '3020001003',
        'enable': '3020001021',
		'copy': '3020001041'
    };
    return resource;
});