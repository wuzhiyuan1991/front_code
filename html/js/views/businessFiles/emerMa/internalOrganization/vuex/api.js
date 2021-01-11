define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'emerposition/disable'},

        queryEmerGroups: {method: 'GET', url: 'emergroup/list/1/9999?type=1&criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0'},
        saveEmerGroupOrderNo: {method: 'PUT', url: 'emergroup/order'},
        createEmerGroup: {method: 'POST', url: 'emergroup'},
        updateEmerGroup: {method: 'PUT', url: 'emergroup'},
        removeEmerGroup: {method: 'DELETE', url: 'emergroup'},

        queryUsers : {method: 'GET', url: 'emerposition/users/list/{pageNo}/{pageSize}'},
        saveUsers : {method: 'POST', url: 'emerposition/{id}/users'},
        removeUsers : _.extend({method: 'DELETE', url: 'emerposition/{id}/users'}, apiCfg.delCfg),

    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("emerposition"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'createGroup': '9020001001',
        'editGroup':   '9020001002',
        'deleteGroup': '9020001003',
        'create': '9020001011',
        'edit':   '9020001012',
        'delete': '9020001013',
        'import': '9020001014',
        'export': '9020001015',
        'enable': '9020001016',
        'copy': '9020001017'
    };
    return resource;
});