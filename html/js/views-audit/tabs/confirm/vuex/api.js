define(function(require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getTreeData: { method: 'GET', url: 'audittask/treeList/{id}?types={types}' },
        getChildren: { method: 'GET', url: 'audittask/tree/{id}' },
        batchScore: { method: 'PUT', url: 'audittask/score' },
        getFiles: { method: 'GET', url: 'file/list/1/1000?criteria.strsValue={recordIds}&filetype=[S]' },
        audit: { method: 'PUT', url: 'audittask/audit' },
        getPlan: {method: 'GET', url: 'auditplan/{id}'},
        queryFolderList: {method: 'GET', url: 'auditfile/list'}, // 获取文件目录列表
        getPdfPath: {method: 'GET', url: 'file/previewpdf/{id}'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("auditelement"));
    var resource = Vue.resource(null, {}, customActions);
    return resource;
});
