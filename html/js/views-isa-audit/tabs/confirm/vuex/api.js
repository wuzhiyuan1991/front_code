define(function(require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getTreeData: { method: 'GET', url: 'isaaudittask/treeList/{id}?types={types}' },
        getChildren: { method: 'GET', url: 'isaaudittask/tree/{id}' },
        batchScore: { method: 'PUT', url: 'isaaudittask/score' },
        getFiles: { method: 'GET', url: 'file/list/1/1000?criteria.strsValue={recordIds}&filetype=[S]' },
        audit: { method: 'PUT', url: 'isaaudittask/audit' }
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("isaauditelement"));
    var resource = Vue.resource(null, {}, customActions);
    return resource;
});
