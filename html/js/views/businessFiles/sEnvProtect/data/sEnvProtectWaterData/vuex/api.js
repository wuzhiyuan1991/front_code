define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'wastewaterdectction/disable'},

    queryFieldName:{method:"get",url:'standardconfig/list/1/10'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("wastewaterdectction"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
       'create': '9410003001',
        'edit':   '9410003002',
        'delete': '9410003003',
        'import': '9410003004',
        'export': '9410003005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});