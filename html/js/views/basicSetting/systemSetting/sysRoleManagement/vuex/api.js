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

        saveUsers : {method: 'POST', url: 'role/{id}/users'},
        removeUsers : _.extend({method: 'DELETE', url: 'role/{id}/users'}, apiCfg.delCfg),
        copyRole:{method: 'POST', url: 'role/{id}/copy'},

    };
    var resource = Vue.resource(null, {}, customActions);
    return resource;
});