define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {

        updateDisable : {method: 'PUT', url: 'optask/disable'},
        saveSubmit : {method: 'PUT', url: 'optask/submit'},
        saveAudit : {method: 'PUT', url: 'optask/audit'},
        savePublish : {method: 'PUT', url: 'optask/publish'},

        queryOpTaskSteps : {method: 'GET', url: 'optask/optasksteps/list/{pageNo}/{pageSize}'},
        saveOpTaskStep : {method: 'POST', url: 'optask/{id}/optaskstep'},
        removeOpTaskSteps : _.extend({method: 'DELETE', url: 'optask/{id}/optasksteps'}, apiCfg.delCfg),
        updateOpTaskStep : {method: 'PUT', url: 'optask/{id}/optaskstep'},
        moveOpTaskSteps : {method: 'PUT', url: 'optask/{id}/optasksteps/order'},

        queryOpTaskStepItems : {method: 'GET', url: 'optaskstep/optaskstepitems/list/{pageNo}/{pageSize}'},
        saveOpTaskStepItem : {method: 'POST', url: 'optaskstep/{id}/optaskstepitem'},
        removeOpTaskStepItems : _.extend({method: 'DELETE', url: 'optaskstep/{id}/optaskstepitems'}, apiCfg.delCfg),
        updateOpTaskStepItem : {method: 'PUT', url: 'optaskstep/{id}/optaskstepitem'},
        moveOpTaskStepItems : {method: 'PUT', url: 'optaskstep/{id}/optaskstepitems/order'},

        queryUsers : {method: 'GET', url: 'optask/users/list/{pageNo}/{pageSize}'},
        saveUsers : {method: 'POST', url: 'optask/{id}/users'},
        removeUsers : _.extend({method: 'DELETE', url: 'optask/{id}/users'}, apiCfg.delCfg),

        updateCardId: {method: 'PUT', url: 'optask/{id}/opcard'},
        getGroupAndItem: {method:'GET', url: 'optask/{id}/items'},
        //删除文件
        _deleteFile: {method: 'DELETE', url: 'file'},
        queryOpCraftsProcesses : {method: 'GET', url: 'optask/opcraftsprocesses/list/{pageNo}/{pageSize}'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("optask"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '1110002001',
        'edit':   '1110002002',
        'delete': '1110002003',
        'submit':'1110002007',
        'audit':'1110002008',
        'publish':'1110002009',
        'preview':'1110002010',
        //'import':'1110002004',
        //'export':'1110002005',
    };
    return resource;
});