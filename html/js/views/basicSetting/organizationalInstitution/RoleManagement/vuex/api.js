define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        updateDisable: {method: "PUT", url: 'role/disable'},
        updateStartup: {method: "PUT", url: 'role/startup'},
        //listDept: {method: 'GET', url: 'organization/list'},
        //listUser: {method: 'GET', url: 'user/list'},
        //del: {method: 'DELETE', url: 'role'},
        listData:{method:'GET',url:'role/data/{roleId}'},
        //listUserByName:{method:'GET',url:'user/like'},
        //distribution: {method: 'PUT', url: 'role/distribution'},
        listFunc: {method: 'GET', url: 'role/func/list'},
        getFunc: {method: 'GET', url: 'role/func'},
        // distributionData: {method: 'POST', url: 'role/distribution/data'},
        distributionData: {method: 'POST', url: 'role/data/{roleId}'},
        distributionFunc: {method: 'POST', url: 'role/distribution/func'},
        distributionMenu: {method: 'POST', url: 'role/distribution/func/menu'},
        distributionMenuAndFunc: {method: 'POST', url: 'role/{id}/auth'},
        distributionMenuAndFuncs: {method: 'POST', url: 'role/auth/{type}/batch'},
        ///role/distribution/funcAndMenu
        listMenu:{method:"GET", url: 'menu/{roleId}/list'},
        listRoleMenu:{method:"GET", url: 'menu/roles/list'},
        //list : {method: 'GET', url: 'role/list/{pageNo}/{pageSize}'},
        //get : {method: 'GET', url: 'role/{id}'},
        //create : {method: 'POST', url: 'role'},
        //update : {method: 'PUT', url: 'role'},
        //remove : _.extend({method: 'DELETE', url: 'role'}, apiCfg.delCfg),
        //exportExcel : {method: 'GET', url: 'role/exportExcel'},
        //importExcel : {method: 'POST', url: 'role/importExcel'},
        //queryUsers : {method: 'GET', url: 'role/users/list/{pageNo}/{pageSize}'},
        saveUsers : {method: 'POST', url: 'role/{id}/users'},
        saveOtherOrganUsers : {method: 'POST', url: 'role/{id}/otherOrgan/users'},
        removeUsers : _.extend({method: 'DELETE', url: 'role/{id}/users'}, apiCfg.delCfg),
        removeOtherOrganUsers : _.extend({method: 'DELETE', url: 'role/{id}/otherOrgan/users'}, apiCfg.delCfg),
        copyRole:{method: 'POST', url: 'role/{id}/copy'},

        getAppMenuList: {method: 'GET', url: 'role/appfunc'},
        getAppAllMenuList: {method: 'GET', url: 'menu/app/{roleId}/list'},
        getAppRolesList: {method: 'GET', url: 'menu/app/roles/list'},
        getAppSetEnable: {method: 'GET', url: 'lookup/syscfg/value?path=sys_global_conf.app_auth_setting_enable'}

    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("role"));
    var resource = Vue.resource(null, {}, customActions);
    resource.__auth__ = {
        'create': '1020006001',
        'export': '1020006005',
        'edit': '1020006002',
        'delete': '1020006003',
        'enable': '1020006021',
        'copy': '1020006008',
        'batchFeature': '1020006009',
        'feature': '1020006024',
        'dataAuth': '1020006604'
    };
    return resource;
});