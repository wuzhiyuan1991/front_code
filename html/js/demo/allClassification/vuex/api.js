define(function(require){

    var Vue = require("vue");
	
	var customActions = {
		_delete:{method:'DELETE',url:'riskassessment',contentType:"application/json;charset=UTF-8"},
	    list: {method: 'GET', url: 'checkmethod/list/{pageNo}/{pageSize}'},
	    get: {method: 'GET', url: 'riskassessment/{id}'},
	    //获取业务对象关联的文件信息
	    getExpertSupport: {method: 'GET', url: 'checkitem/{id}'},
	    _deleteExpertSupport:{method: 'DELETE',url:'checkitem/deleteExpertSupport'},
	    createitemSupport:{method:'POST',url:'checkitem/createItemSupport'},
	    getUUID: {method: 'GET', url: 'helper/getUUID'},
	    getRiskType:{method:'GET',url:'risktype/list'},
	    getHazardFactor:{method:'GET',url:'hazardfactor/list'},
	    create:{method:'POST',url:'riskassessment'},
	    update:{method:'PUT',url:'riskassessment'},
	    updateState:{method:'PUT',url:'riskassessment/updateState'},
	    selectList:{method:'GET',url:'riskassessment/list'},
	    updateRiskType:{method:'PUT',url:'risktype'},
	    deleteRiskType:{method:'DELETE',url:'risktype',contentType:"application/json;charset=UTF-8"},
	    createRiskType:{method:'POST',url:'risktype'},
	    //初始化组织机构
	    listOrganization:{method: 'GET', url: 'organization/list'},
	};
	
	var resource = Vue.resource(null,{}, customActions);
    return resource;
});