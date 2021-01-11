define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'wastewaterequirecord/disable'},

    queryFieldName:{method:"get",url:'standardconfig/list/1/10'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("wastewaterequirecord"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '9410006001',
        'edit':   '9410006002',
        'delete': '9410006003',
        'import': '9410006004',
        'export': '9410006005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});