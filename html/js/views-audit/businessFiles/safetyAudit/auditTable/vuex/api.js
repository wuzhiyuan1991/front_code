define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        audit: { method: 'PUT', url: 'audittable/status'},
        updateDisable: { method: 'PUT', url: 'audittable/disable'},
        getFactorById: { method: 'GET', url: 'auditelement/treeList/{id}?types={types}'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("audittable"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '6020001001',
        'edit': '6020001002',
        'delete': '6020001003',
        'enable': '6020001006',
        'copy':'6020001008'
    };
    return resource;
});