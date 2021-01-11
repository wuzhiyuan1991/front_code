define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'auditunfinishedtask/disable'},
        deleteByIds:{method: 'DELETE', url: 'auditunfinishedtask/ids'},
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("auditunfinishedtask"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '_YYYYYYY001',
        // 'edit':   '_YYYYYYY002',
        'delete': '6010005003',
        // 'import': '_YYYYYYY004',
        // 'export': '_YYYYYYY005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});