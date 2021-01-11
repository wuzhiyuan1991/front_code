define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'jsamasternew/disable'},

		queryJsaDetailNews : {method: 'GET', url: 'jsamasternew/jsadetailnews/list/{pageNo}/{pageSize}'},
		saveJsaDetailNew : {method: 'POST', url: 'jsamasternew/{id}/jsadetailnew'},
		removeJsaDetailNews : _.extend({method: 'DELETE', url: 'jsamasternew/{id}/jsadetailnews'}, apiCfg.delCfg),
		updateJsaDetailNew : {method: 'PUT', url: 'jsamasternew/{id}/jsadetailnew'},
		moveJsaDetailNews : {method: 'PUT', url: 'jsamasternew/{id}/jsadetailnews/order'},

        queryStepsByCardId: {method: 'GET', url: 'jsadetailnew/card/{cardId}'}, // 查询票卡的步骤

        submit: {method: 'PUT', url: 'jsamasternew/submit'}, // 提交审核
        audit: {method: 'PUT', url: 'jsamasternew/audit'}, // 审核
        quit: {method: 'PUT', url: 'jsamasternew/quit'}, // 弃审
        sendTask: {method: 'PUT', url: 'jsamasternew/publish'},
        invalid: {method: 'PUT', url: 'jsamasternew/invalid'},

        getUUID: {method: 'GET', url: 'helper/getUUID'},

    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("jsamasternew"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '1410001001',
        'edit':   '1410001002',
        'delete': '1410001003',
        'import': '1410001004',
        'export': '1410001005',
        'submit': '1410001006',
        'audit': '1410001007',
        'quit': '1410001008',
        'enable': '1410001009',
        'send': '1410001201',
        'invalid':'1410001010',
        'copy': '1410001011'
    };
    return resource;
});