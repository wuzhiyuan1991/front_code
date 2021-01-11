define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        audit: { method: 'PUT', url: 'isaaudittable/status'},
        updateDisable: { method: 'PUT', url: 'isaaudittable/disable'},
        getFactorById: { method: 'GET', url: 'isaauditelement/treeList/{id}?types={types}'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("isaaudittable"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '6040001001',
        'edit': '6040001002',
        'delete': '6040001003',
        'import': '6040001004',
        'enable': '6030001006'
    };
    return resource;
});