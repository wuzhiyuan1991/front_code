define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		
    queryLegalTypes:{method: 'GET', url: 'irllegalregulationtype/list'},
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("irllegalregulationevaluation"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '9310003001',
        'edit':   '9310003002',
        'delete': '9310003003',
        'import': '9310003004',
        'export': '9310003005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});