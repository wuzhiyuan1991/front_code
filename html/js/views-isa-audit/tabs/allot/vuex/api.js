define(function(require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getData: { method: 'GET', url: 'isaaudittask/treeList/{id}?types={types}' },
        getChildren: { method: 'GET', url: 'isaaudittask/tree/{id}' },
        batchOwner: { method: 'PUT', url: 'isaaudittask/assigned' },
        allotAll: { method: 'PUT', url: 'isaaudittask/assigned/all' }
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("isaauditelement"));
    var resource = Vue.resource(null, {}, customActions);
    return resource;
});
