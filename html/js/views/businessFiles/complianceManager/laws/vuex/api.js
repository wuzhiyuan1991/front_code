define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        updateDisable: {method: 'PUT', url: 'laws/disable'},
        getFileList: {method: 'GET', url: "file/list"},
        queryLawsChapters: {method: 'GET', url: 'laws/lawschapters/list/1/9999'},
        saveLawsChapter: {method: 'POST', url: 'laws/{id}/lawschapter'},
        removeLawsChapters: _.extend({method: 'DELETE', url: 'laws/{id}/lawschapters'}, apiCfg.delCfg),
        updateLawsChapter: {method: 'PUT', url: 'laws/{id}/lawschapter'},
        moveLawsChapters: {method: 'PUT', url: 'laws/{id}/lawschapters/order'},
        getTreeList: {method: 'GET', url: 'lawstype/list'},
        createLegalType: {method: 'post', url: 'lawstype'},
        updateLegalType: {method: 'put', url: 'lawstype'},
        deleteLegalType: {method: 'delete', url: 'lawstype'},
        saveContent: {method: 'post', url: 'lawschapter/{id}/lawscontent'},
        removeContent: {method: 'DELETE', url: 'lawschapter/{id}/lawscontents'},
        updateContent: {method: 'PUT', url: 'lawschapter/{id}/lawscontent'},
        queryContent: {method: 'GET', url: 'lawschapter/lawscontents/list/{currentPage}/{pageSize}'},
        queryContentList: {method: 'GET', url: 'lawschapter/lawscontents/list'},
        queryContent: {method: 'GET', url: 'lawscontent/list'},
        
        getUUID: {method: 'GET', url: 'helper/getUUID'},
        querylawsrevise:{method:'GET',url:'lawsrevise/list'},
        updateRevision: {method: 'put', url: 'laws/revision'},
        
    };
    
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("laws"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2040001001',
        'edit':   '2040001002',
        'delete': '2040001003',
        'import': '2040001004',
        'export': '2040001005',
        // 'enable': '_YYYYYYY006',
        'revise': '2040001007',

        'createType': '2040001008',
        'editType':   '2040001009',
        'deleteType': '2040001010',
        'importType': '2040001011',
        'exportType': '2040001012',

    };
    return resource;
});