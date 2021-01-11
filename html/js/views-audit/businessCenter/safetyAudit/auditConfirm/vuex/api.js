define(function(require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getTreeData: { method: 'GET', url: 'audittask/treeList/{id}?types={types}' },
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("auditplan"));
    var resource = Vue.resource(null, {}, customActions);
    resource.__auth__ = {
        'view': '6010003001'
    };
    return resource;
});
