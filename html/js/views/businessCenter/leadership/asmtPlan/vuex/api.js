define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        queryAsmtTasks: {method: 'GET', url: 'asmtplan/asmttasks/list/{pageNo}/{pageSize}'},
        saveAsmtTask: {method: 'POST', url: 'asmtplan/{id}/asmttask'},
        removeAsmtTasks: _.extend({method: 'DELETE', url: 'asmtplan/{id}/asmttasks'}, apiCfg.delCfg),
        updateAsmtTask: {method: 'PUT', url: 'asmtplan/{id}/asmttask'},
        queryUsers: {method: 'GET', url: 'asmtplan/users/list/{pageNo}/{pageSize}'},
        saveUsers: {method: 'POST', url: 'asmtplan/{id}/users'},
        removeUsers: _.extend({method: 'DELETE', url: 'asmtplan/{id}/users'}, apiCfg.delCfg),
        publicPlan: {method: 'PUT', url: 'asmtplan/publish'},
        getUsers: {method: 'GET', url: 'asmtplan/users/list'},
        invalid: {method: 'PUT', url: 'asmtplan/invalid'},
        queryPreTaskList: {method: 'GET', url: 'asmtplan/asmttasks/view/1/999'},
        queryTaskList: {method: 'GET', url: 'asmtplan/asmttasks/list/1/999'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("asmtplan"));
    var resource = Vue.resource(null, {}, customActions);
    resource.__auth__ = {
        'create': '8010001001',
        'edit': '8010001002',
        'delete': '8010001003',
        'publish': '8010001006',
        'invalid': '8010001202'
    };
    return resource;
});