define(function(require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getTreeData: { method: 'GET', url: 'isaaudittask/treeList/{id}?types={types}' },
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("isaauditplan"));
    var resource = Vue.resource(null, {}, customActions);
    resource.__auth__ = {
        'view': '6030003001'
    };
    return resource;
});
