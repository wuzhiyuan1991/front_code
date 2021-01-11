define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'jsamasternew/disable'},
        create : {method: 'POST', url: 'jsamasternew?_bizModule=xbgd'},
        update : {method: 'PUT', url: 'jsamasternew?_bizModule=xbgd'},
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
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("jsamasternew"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '1710001001',
        'edit':   '1710001002',
        'delete': '1710001003',
        'export': '1710001005',
        'send': '1710001012',
        'copy': '1710001011'
    };
    return resource;
});