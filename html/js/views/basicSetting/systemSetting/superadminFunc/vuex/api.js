define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");
    var customActions = {
        clearCheckData:{method:'DELETE',url:'/superadmin/checkData'},
        clearTrainData:{method:'DELETE',url:'/superadmin/trainData'},
        initMobileData:{method:'PUT',url:'/superadmin/mobile/init/data'},
        mobileReloginAll:{method:'GET',url:'/superadmin/mobile/relogin/all'},
        registerbatch:{method:'GET',url:'/superadmin/registerbatch'},
        getHistory: {method: 'GET', url: '/taskcallback/list'},
        listQuestion: {method: 'GET', url: '/errordatamgr/list'},
        fixQuestion: {method: 'POST', url: '/errordatamgr/resolve'},
        syncForcedAppVersion:{method:'GET',url:'/superadmin/sync/appversion'},
        updateAllOrgAttr3:{method:'GET',url:'/superadmin/refresh/org/attr3'},
        removeBatch:{method:'GET',url:'/superadmin/removebatch'},
        updateRiskIdentificationEquipment:{method:'GET',url:'/superadmin/refresh/riskIdentification/equipment'},
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("envconfig"));
    var resource = Vue.resource(null, {}, customActions);
    return resource;
});