define(function(require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getTreeData: { method: 'GET', url: 'auditelement/treeList/{id}?types={types}' },
        getChildren: { method: 'GET', url: 'auditelement/tree/{id}' },
        changeOrder: { method: 'PUT', url: 'auditelement/order' },
        getAuditTable: { method: 'GET', url: 'audittable/{id}' },
        getWeight: { method: 'GET', url: 'auditelement/weight?auditTableId={id}' },
        createFolder: {method: 'POST', url: 'auditfile'},
        updateFolder: {method: 'PUT', url: 'auditfile'},
        moveFolder: {method: 'PUT', url: 'auditfile/order'},
        queryFolderList: {method: 'GET', url: 'auditfile/list'}, // 获取文件目录列表
        deleteAuditFile: {method: 'DELETE', url: 'auditfile'},
        getPdfPath: {method: 'GET', url: 'file/previewpdf/{id}'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("auditelement"));
    var resource = Vue.resource(null, {}, customActions);
    return resource;
});
