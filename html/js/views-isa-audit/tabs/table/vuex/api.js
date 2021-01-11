define(function(require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getTreeData: { method: 'GET', url: 'isaauditelement/treeList/{id}?types={types}' },
        getChildren: { method: 'GET', url: 'isaauditelement/tree/{id}' },
        changeOrder: { method: 'PUT', url: 'isaauditelement/order' },
        getAuditTable: { method: 'GET', url: 'isaaudittable/{id}' },
        getWeight: { method: 'GET', url: 'isaauditelement/weight?auditTableId={id}' }
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("isaauditelement"));
    var resource = Vue.resource(null, {}, customActions);
    return resource;
});
