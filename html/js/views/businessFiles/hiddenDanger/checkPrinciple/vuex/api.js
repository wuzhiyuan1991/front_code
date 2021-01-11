define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'checkprinciple/disable'},
        updateBatch:{method:'PUT',url:'checkprinciple/batch'},
        getMainList:{method:'GET', url:'checkprinciple/list/1/300'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("checkprinciple"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '_YYYYYYY001',
        // 'edit':   '_YYYYYYY002',
        // 'delete': '_YYYYYYY003',
        // 'import': '_YYYYYYY004',
        // 'export': '_YYYYYYY005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});