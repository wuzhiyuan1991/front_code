define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		// updateDisable : {method: 'PUT', url: 'standard/disable'},

		// queryStandardChapters : {method: 'GET', url: 'standard/standardchapters/list/{pageNo}/{pageSize}'},
		// saveStandardChapter : {method: 'POST', url: 'standard/{id}/standardchapter'},
		// removeStandardChapters : _.extend({method: 'DELETE', url: 'standard/{id}/standardchapters'}, apiCfg.delCfg),
		// updateStandardChapter : {method: 'PUT', url: 'standard/{id}/standardchapter'},
		// moveStandardChapters : {method: 'PUT', url: 'standard/{id}/standardchapters/order'},
    updateDisable: {method: 'PUT', url: 'standard/disable'},
    getFileList: {method: 'GET', url: "file/list"},
    querystandardChapters: {method: 'GET', url: 'standard/standardchapters/list/1/9999'},
    savestandardChapter: {method: 'POST', url: 'standard/{id}/standardchapter'},
    removestandardChapters: _.extend({method: 'DELETE', url: 'standard/{id}/standardchapters'}, apiCfg.delCfg),
    updatestandardChapter: {method: 'PUT', url: 'standard/{id}/standardchapter'},
    movestandardChapters: {method: 'PUT', url: 'standard/{id}/standardchapters/order'},
    getTreeList: {method: 'GET', url: 'standardtype/list'},
    createLegalType: {method: 'post', url: 'standardtype'},
    updateLegalType: {method: 'put', url: 'standardtype'},
    deleteLegalType: {method: 'delete', url: 'standardtype'},
    saveContent: {method: 'post', url: 'standardchapter/{id}/standardcontent'},
    removeContent: {method: 'DELETE', url: 'standardchapter/{id}/standardcontents'},
    updateContent: {method: 'PUT', url: 'standardchapter/{id}/standardcontent'},
    // queryContent: {method: 'GET', url: 'standardchapter/standardcontents/list/{currentPage}/{pageSize}'},
    queryContentList: {method: 'GET', url: 'standardchapter/standardcontents/list'},
    queryContent: {method: 'GET', url: 'standardcontent/list'},
    
    getUUID: {method: 'GET', url: 'helper/getUUID'},
    querystandardrevise:{method:'GET',url:'standardrevise/list'},
    updateRevision: {method: 'put', url: 'standard/revision'},
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("standard"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2040003001',
        'edit':   '2040003002',
        'delete': '2040003003',
        'import': '2040003004',
        'export': '2040003005',
        // 'enable': '_YYYYYYY006',
        'revise': '2040003007',

        'createType': '2040003008',
        'editType':   '2040003009',
        'deleteType': '2040003010',
        'importType': '2040003011',
        'exportType': '2040003012',
    };
    return resource;
});