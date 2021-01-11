define(function(require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getData: { method: 'GET', url: 'audittask/treeList/{id}?types={types}' },
        getChildren: { method: 'GET', url: 'audittask/tree/{id}' },
        batchOwner: { method: 'PUT', url: 'audittask/assigned' },
        allotAll: { method: 'PUT', url: 'audittask/assigned/all' },
        queryFolderList: {method: 'GET', url: 'auditfile/list'},
        getPlan: {method: 'GET', url: 'auditplan/{id}'},
        getPdfPath: {method: 'GET', url: 'file/previewpdf/{id}'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("auditelement"));
    var resource = Vue.resource(null, {}, customActions);
    return resource;
});
