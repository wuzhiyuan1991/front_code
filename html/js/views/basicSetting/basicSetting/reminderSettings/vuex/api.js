define(function(require){

    var Vue = require("vue");
	var apiCfg = require("apiCfg");
	var customActions = {
		
	    //list: {method: 'GET', url: 'remind/list/{pageNo}/{pageSize}'},
	    //get: {method: 'GET', url: 'remind/{id}'},
	    rel: {method: 'GET', url: 'remind/rel'},
		listLookup:{method: 'GET', url: 'remind/lookup'},
		listLookupItem:{method: 'GET', url: 'remind/lookupItem'},
		listOrg: {method: 'GET', url: 'organization/list'},
		listUser: {method: 'GET', url: 'user/list'},
		listRole: {method: 'GET', url: 'role/list'},
		generate:{method:'GET',url:'remind/code'},
        //create: {method: 'POST', url: 'remind'},
        //update: {method: 'PUT', url: 'remind'},
        delete: {method: 'DELETE', url: 'remind'},
		remove:{method: 'DELETE', url: 'remind/{id}/remindmodelrels'},

	    //获取业务对象关联的文件信息
	    
	    
	};
	customActions = _.defaults(customActions, apiCfg.buildDefaultApi("remind"));
	var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '1010003001',
        'edit': '1010003002',
        'delete': '1010003003',
		'import': '1010004004'
    };
    return resource;
});