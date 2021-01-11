define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {

        //list: {method: 'GET', url: 'organization/list/{pageNo}/{pageSize}'},
        //get: {method: 'GET', url: 'organization/{id}'},
        //create: {method: 'POST', url: 'organization/dept'},
        //update: {method: 'PUT', url: 'organization/dept'},
        rel: {method: 'GET', url: 'dept/rel'},
        del: {method: 'DELETE', url: 'dept/dept'},
        listDept: {method: 'GET', url: 'dept/list'},

        //初始化组织机构
        listOrganization:{method: 'GET', url: 'dept/list'},
        //remove : _.extend({method: 'DELETE', url: 'organization/dept'}, apiCfg.delCfg),
        //exportExcel : {method: 'GET', url: 'organization/exportExcel'},
        //importExcel : {method: 'POST', url: 'organization/importExcel'},

        list : {method: 'GET', url: 'dept/list/{pageNo}/{pageSize}'},
        get : {method: 'GET', url: 'dept/{id}'},
        create : {method: 'POST', url: 'dept'},
        update : {method: 'PUT', url: 'dept'},
        remove : _.extend({method: 'DELETE', url: 'dept'}, apiCfg.delCfg),
        exportExcel : {method: 'GET', url: 'dept/exportExcel'},
        importExcel : {method: 'POST', url: 'dept/importExcel'},
        queryUsers : {method: 'GET', url: 'dept/users/list/{pageNo}/{pageSize}'},
        saveUser : {method: 'POST', url: 'dept/{id}/users'},
        removeUsers : _.extend({method: 'DELETE', url: 'dept/{id}/users'}, apiCfg.delCfg),
        updateUser : {method: 'PUT', url: 'dept/{id}/user'},
        listTree:{method:'GET',url:'user/tree'},
        create4copy : {method: 'POST', url: 'dept/{id}/copy'},

        order:{method: 'PUT', url: 'dept/order'},
        updateDisable: {method: 'PUT', url: 'dept/disable'},
        countChildrenOrg:{method: 'GET', url: 'organization/children/count'},
    };

    var resource = Vue.resource(null, {}, customActions);
    resource.__auth__ = {
        'create': '1020002001',
        'import': '1020002004',
        'export': '1020002005',
        'edit': '1020002002',
        'delete': '1020002003',
        'copy':'1020002010',
        'enable':'1020002009',
        'allview':'1020002011'
    };
    return resource;
});