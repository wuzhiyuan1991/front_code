define(function(require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getTreeData: { method: 'GET', url: 'isaaudittask/treeList/{id}?types={types}' },
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("isaauditplan"));
    var resource = Vue.resource(null, {}, customActions);
    resource.__auth__ = {
        'grade': '6030002001',
        'allot': '6030002002'
    };
    return resource;
});
