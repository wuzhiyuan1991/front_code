define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getTreeData: { method: 'GET', url: 'auditelement/treeList/{id}?types={types}'},
        publish: { method: 'PUT', url: 'auditplan/publish'},
        freeze: {method: 'PUT', url: 'auditplan/freeze'},
        recovery: {method: 'PUT', url: 'auditplan/recovery'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("auditplan"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '6010001001',
        'edit': '6010001002',
        'delete': '6010001003',
        'publish': '6010001004',
        'freeze': '6010001007',
        'recovery': '6010001008'
    };
    return resource;
});