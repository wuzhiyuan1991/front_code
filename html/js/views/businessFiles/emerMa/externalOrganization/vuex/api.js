define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'emergroup/disable'},

		queryPositions : {method: 'GET', url: 'emergroup/positions/list/{pageNo}/{pageSize}'},
		savePosition : {method: 'POST', url: 'emergroup/{id}/position'},
		removePositions : _.extend({method: 'DELETE', url: 'emergroup/{id}/positions'}, apiCfg.delCfg),
		updatePosition : {method: 'PUT', url: 'emergroup/{id}/position'},

		queryEmerLinkmen : {method: 'GET', url: 'emergroup/emerlinkmen/list/{pageNo}/{pageSize}'},
		saveEmerLinkman : {method: 'POST', url: 'emergroup/{id}/emerlinkman'},
		removeEmerLinkmen : _.extend({method: 'DELETE', url: 'emergroup/{id}/emerlinkmen'}, apiCfg.delCfg),
		updateEmerLinkman : {method: 'PUT', url: 'emergroup/{id}/emerlinkman'},

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("emergroup"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
         'create': '9020002001',
         'edit':   '9020002002',
         'delete': '9020002003',
         'import': '9020002004',
         'export': '9020002005',
         'enable': '9020002006',
         'copy':   '9020002007'
    };
    return resource;
});