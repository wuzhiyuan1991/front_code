define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'riskjudgmenttask/disable'},
        riskjudgmenttaskdetail:{method:'GET',url:'riskjudgmenttaskdetail/list'},
        // riskjudgmenttaskUserList:{method: 'GET', url: 'user/list?criteria.strsValueuserIds'},
        riskjudgmenttaskUserList:{method: 'GET', url: 'user/list?criteria.strsValueuserIds'},
        riskjudgmenttaskUnderling:{method:'GET', url:'riskjudgmenttask/underling/list/1/9999'},

        submitRiskInfo:{method: 'POST', url:'riskjudgmentrecord'},
        riskjudgmenttaskCompany:{method:"GET", url:'riskjudgmentrecord/task/{id}'},
        getCount:{method:'GET',url:'riskjudgmenttask/count/user/unfinished'},
        checkData:{method:'GET',url:'riskjudgmenttask/checkdata/execute/{id}'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("riskjudgmenttask"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '_YYYYYYY001',
        // 'edit':   '_YYYYYYY002',
        // 'delete': '_YYYYYYY003',
        // 'import': '_YYYYYYY004',
        // 'export': '_YYYYYYY005',
        // 'enable': '_YYYYYYY006',
        'execute':'5030001007'
    };
    return resource;
});