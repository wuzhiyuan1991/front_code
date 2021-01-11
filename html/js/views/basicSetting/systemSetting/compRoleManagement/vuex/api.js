define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        updateDisable: {method: "PUT", url: 'role/disable'},
        updateStartup: {method: "PUT", url: 'role/startup'},
        listData:{method:'GET',url:'role/data/{roleId}'},
        listFunc: {method: 'GET', url: 'role/func/list'},
        getFunc: {method: 'GET', url: 'role/func'},
        getFuncByCompId: {method: 'GET', url: 'role/func/comp'},
        distributionData: {method: 'POST', url: 'role/data/{roleId}'},
        distributionFunc: {method: 'POST', url: 'role/distribution/func'},
        distributionMenu: {method: 'POST', url: 'role/distribution/func/menu'},
        distributionMenuAndFuncByComp: {method: 'POST', url: 'role/comp/{compId}/auth'},
        distributionMenuAndFuncs: {method: 'POST', url: 'role/auth/{type}/batch'},
        listMenu:{method:"GET", url: 'menu/comp/list'},
        saveUsers : {method: 'POST', url: 'role/{id}/users'},
        removeUsers : _.extend({method: 'DELETE', url: 'role/{id}/users'}, apiCfg.delCfg),

        getAppMenuList: {method: 'GET', url: 'role/appfunc/comp'},
        getAppAllList: {method: 'GET', url: 'appmenu/list?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0'},
        getAppSetEnable: {method: 'GET', url: 'lookup/syscfg/value?path=sys_global_conf.app_auth_setting_enable'},

        listAllMenu: {method: 'GET', url: 'menu/comp/list'},
        updateBatch: {method: 'POST', url: 'role/comp/auth/{type}/batch'}
    };
    var resource = Vue.resource(null, {}, customActions);
    return resource;
});