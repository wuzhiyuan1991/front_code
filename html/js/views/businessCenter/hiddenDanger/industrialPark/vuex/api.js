define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'industrialpark/disable'},
        getFileList:{method:'GET',url:"file/list"}, //文件
		queryDominationAreas : {method: 'GET', url: 'industrialpark/dominationareas/list/{pageNo}/{pageSize}'},
		saveDominationAreas : {method: 'POST', url: 'industrialpark/{id}/dominationareas'},
		removeDominationAreas : _.extend({method: 'DELETE', url: 'industrialpark/{id}/dominationareas'}, apiCfg.delCfg),
        getUUID: {method: 'GET', url: 'helper/getUUID'},
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("industrialpark"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '_YYYYYYY001',
        // 'edit':   '_YYYYYYY002',
        // 'delete': '_YYYYYYY003',
        // 'import': '_YYYYYYY004',
        // 'export': '_YYYYYYY005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});