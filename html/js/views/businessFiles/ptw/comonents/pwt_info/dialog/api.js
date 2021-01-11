define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        updateDisable : {method: 'PUT', url: 'ptwcardcolumnsetting/disable'},
        // queryColumnSettings : {method: 'GET', url: 'ptwcardtpl/columnsettings/list/{pageNo}/{pageSize}'},
        queryColumnSettings : {method: 'GET', url: 'ptwcardtpl/columnsettings/list'},
        saveColumnSetting : {method: 'POST', url: 'ptwcardtpl/{id}/columnsetting'},
        removeColumnSettings : _.extend({method: 'DELETE', url: 'ptwcardtpl/{id}/columnsettings'}, apiCfg.delCfg),
        updateColumnSetting : {method: 'PUT', url: 'ptwcardtpl/{id}/columnsetting'},
        moveColumnSettings : {method: 'PUT', url: 'ptwcardtpl/{id}/columnsettings/order'},
        queryDefaultSetting: {method: 'GET', url:'ptwcardtpl/defaultcolumnsettings/list'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("ptwcardcolumnsetting"));
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