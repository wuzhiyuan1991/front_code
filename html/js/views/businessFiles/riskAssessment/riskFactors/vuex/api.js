define(function(require){

    var Vue = require("vue");
	var apiCfg = require("apiCfg");
	var customActions = {
		
	    //list: {method: 'GET', url: 'hazardfactor/list/{pageNo}/{pageSize}'},
	    //get: {method: 'GET', url: 'hazardfactor/{id}'},
	    //create: {method: 'POST', url: 'hazardfactor'},
	    //update: {method: 'PUT', url: 'hazardfactor'},
	    _delete:{method: 'DELETE',url:'hazardfactor',contentType:"application/json;charset=UTF-8"},
	    //获取业务对象关联的文件信息
	    //listFile: {method: 'GET', url: 'file/list'},
	    getUUID: {method: 'GET', url: 'helper/getUUID'},
	    listTableType:{method: 'GET', url:'hazardfactor/list'},
	    //初始化组织机构
	    listOrganization:{method: 'GET', url: 'organization/list'},
	    selectTree:{method:'GET',url:'hazardfactor/selectTree'},
	};
	customActions = _.defaults(customActions, apiCfg.buildDefaultApi("hazardfactor"));
	var resource = Vue.resource(null,{}, customActions);
    return resource;
});