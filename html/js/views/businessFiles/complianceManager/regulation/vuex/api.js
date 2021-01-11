define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		// updateDisable : {method: 'PUT', url: 'regulation/disable'},

		// queryRegulationChapters : {method: 'GET', url: 'regulation/regulationchapters/list/{pageNo}/{pageSize}'},
		// saveRegulationChapter : {method: 'POST', url: 'regulation/{id}/regulationchapter'},
		// removeRegulationChapters : _.extend({method: 'DELETE', url: 'regulation/{id}/regulationchapters'}, apiCfg.delCfg),
		// updateRegulationChapter : {method: 'PUT', url: 'regulation/{id}/regulationchapter'},
		// moveRegulationChapters : {method: 'PUT', url: 'regulation/{id}/regulationchapters/order'},
    updateDisable: {method: 'PUT', url: 'regulation/disable'},
    getFileList: {method: 'GET', url: "file/list"},
    queryregulationChapters: {method: 'GET', url: 'regulation/regulationchapters/list/1/9999'},
    saveregulationChapter: {method: 'POST', url: 'regulation/{id}/regulationchapter'},
    removeregulationChapters: _.extend({method: 'DELETE', url: 'regulation/{id}/regulationchapters'}, apiCfg.delCfg),
    updateregulationChapter: {method: 'PUT', url: 'regulation/{id}/regulationchapter'},
    moveregulationChapters: {method: 'PUT', url: 'regulation/{id}/regulationchapters/order'},
    getTreeList: {method: 'GET', url: 'regulationtype/list'},
    createLegalType: {method: 'post', url: 'regulationtype'},
    updateLegalType: {method: 'put', url: 'regulationtype'},
    deleteLegalType: {method: 'delete', url: 'regulationtype'},
    saveContent: {method: 'post', url: 'regulationchapter/{id}/regulationcontent'},
    removeContent: {method: 'DELETE', url: 'regulationchapter/{id}/regulationcontents'},
    updateContent: {method: 'PUT', url: 'regulationchapter/{id}/regulationcontent'},
    // queryContent: {method: 'GET', url: 'regulationchapter/regulationcontents/list/{currentPage}/{pageSize}'},
    queryContentList: {method: 'GET', url: 'regulationchapter/regulationcontents/list'},
    queryContent: {method: 'GET', url: 'regulationcontent/list'},
    
    getUUID: {method: 'GET', url: 'helper/getUUID'},
    queryregulationrevise:{method:'GET',url:'regulationrevise/list'},
    updateRevision: {method: 'put', url: 'regulation/revision'},
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("regulation"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2040004001',
        'edit':   '2040004002',
        'delete': '2040004003',
        'import': '2040004004',
        'export': '2040004005',
        // 'enable': '_YYYYYYY006',
        'revise': '2040004007',

        'createType': '2040004008',
        'editType':   '2040004009',
        'deleteType': '2040004010',
        'importType': '2040004011',
        'exportType': '2040004012',
    };
    return resource;
});