define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");
    var customActions = {

        //list: {method: 'GET', url: 'position/list/{pageNo}/{pageSize}'},
        get: {method: 'GET', url: 'position/{id}'},
        rel: {method: 'GET', url: 'position/rel'},
        //create: {method: 'POST', url: 'position/hse'},
        //update: {method: 'PUT', url: 'position/hse'},
        del: {method: 'DELETE', url: 'position/hse'},
        listDept: {method: 'GET', url: 'organization/list'},
        listUser: {method: 'GET', url: 'user/list'},
        listUserByName:{method:'GET',url:'user/like'},
        createUsers:{method:"POST",url:'position/users'},
        delUsers:{method:"DELETE",url:'position/users'},
        //初始化组织机构
        listOrganization:{method: 'GET', url: 'organization/list'},


        //remove : _.extend({method: 'DELETE', url: 'position/hse'}, apiCfg.delCfg),
        //exportExcel : {method: 'GET', url: 'position/exportExcel'},
        //importExcel : {method: 'POST', url: 'position/importExcel'},
        queryUsers : {method: 'GET', url: 'position/users/list/{pageNo}/{pageSize}'},
        saveUsers : {method: 'POST', url: 'position/{id}/users'},
        removeUsers : _.extend({method: 'DELETE', url: 'position/{id}/users'}, apiCfg.delCfg),
        create4copy : {method: 'POST', url: 'position/{id}/copy'},
        updateDisable: {method: 'PUT', url: 'position/disable'},

    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("position/hse"));
    var resource = Vue.resource(null, {}, customActions);
    resource.__auth__ = {
        'create': '1020005001',
        'import': '1020005004',
        'export': '1020005005',
        'edit': '1020005002',
        'delete': '1020005003',
        'copy':'1020005010',
        'enable':'1020005009'
    };
    return resource;
});