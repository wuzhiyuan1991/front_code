define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		// queryRiCheckRecordDetails : {method: 'GET', url: 'richeckrecord/richeckrecorddetails/list/{pageNo}/{pageSize}'},
        queryRiCheckRecordDetails : {method: 'GET', url: 'richeckrecord/{id}/richeckrecorddetails/list'},
        saveRiCheckRecordDetail : {method: 'POST', url: 'richeckrecord/{id}/richeckrecorddetail'},
		removeRiCheckRecordDetails : _.extend({method: 'DELETE', url: 'richeckrecord/{id}/richeckrecorddetails'}, apiCfg.delCfg),
		updateRiCheckRecordDetail : {method: 'PUT', url: 'richeckrecord/{id}/richeckrecorddetail'},
        getLastResult: {method: 'GET', url: 'richeckrecord/last/richeckrecorddetail'}, //获取上次检查结果
        getDangerCode: {method: 'GET', url: 'pool/exist/{id}'} // 获取生成的隐患的code
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("richeckrecord"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '2020003001',
        // 'edit':   '2020002002',
        'delete': '4220001007',
        // 'import': '2020002004',
        'export': '4220001005',
    };
    return resource;
});