define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'contractoremp/disable'},

        userUnlock: {method: 'PUT', url: 'user/unlock'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("contractoremp"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '7010003001',
        // 'edit':   '7010003002',
        'delete': '7010003003',
        // 'import': '7010003004',
        'export': '7010003005',
        'enable': '7010003020',
        'resetPwd':'7010003610',
        'unlock':'7010003611',
        'resetAllPwd':'7010003612'
    };
    return resource;
});