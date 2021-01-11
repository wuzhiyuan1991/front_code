define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		
        queryFieldName:{method:"get",url:'standardconfig/list/1/10'}
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("envirfactor"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '9410001001',
        'edit':   '9410001002',
        'delete': '9410001003',
        'import': '9410001004',
        'export': '9410001005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});