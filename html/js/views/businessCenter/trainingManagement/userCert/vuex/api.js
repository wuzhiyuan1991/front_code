define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getUUID: {method: 'GET', url: 'helper/getUUID'},
		updateDisable : {method: 'PUT', url: 'cert/disable'},

		queryCertRetrials : {method: 'GET', url: 'cert/certretrials/list/{pageNo}/{pageSize}'},
		saveCertRetrial : {method: 'POST', url: 'cert/{id}/certretrial'},
		removeCertRetrials : _.extend({method: 'DELETE', url: 'cert/{id}/certretrials'}, apiCfg.delCfg),
		updateCertRetrial : {method: 'PUT', url: 'cert/{id}/certretrial'},

		queryUsers : {method: 'GET', url: 'cert/users/list/{pageNo}/{pageSize}'},
		saveUsers : {method: 'POST', url: 'cert/{id}/users'},
		removeUsers : _.extend({method: 'DELETE', url: 'cert/{id}/users'}, apiCfg.delCfg),

        queryNextRecord: {method: 'GET', url: 'cert/{id}/nextretrial'},

        addAdmin: {method: 'POST', url: 'bizuserrel/batch'},
        getAdmins: {method: 'GET', url: 'bizuserrel/list/1/999?type=2'},
        deleteAdmin: {method: 'DELETE', url: 'bizuserrel'},

        createRemindset: {method: 'POST', url: 'remindset'},
        deleteRemind: {method: 'DELETE', url: 'remindset'},

        updateLookupItem : {method: 'PUT', url: 'lookup/{id}/lookupitem'},
        querySendNotice: {method: 'GET', url: 'lookup/lookupitems/list?code=notice_switch_cfg'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("cert"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
         'create': '4010010001',
         'edit':   '4010010002',
         'delete': '4010010003',
         'import': '4010010004',
         'export': '4010010005',
         'notice': '4010010008',//提醒规则
        // 'enable': '4010010006',
         'search': '4010010009'//证书搜索
    };
    return resource;
});