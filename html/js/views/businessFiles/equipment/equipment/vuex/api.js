define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		queryCheckItems : {method: 'GET', url: 'equipment/checkitems/list/{pageNo}/{pageSize}'},
		saveCheckItem : {method: 'POST', url: 'equipment/{id}/checkitem'},
		removeCheckItems : _.extend({method: 'DELETE', url: 'equipment/{id}/checkitems'}, apiCfg.delCfg),
		updateCheckItem : {method: 'PUT', url: 'equipment/{id}/checkitem'},
		queryEquipmentItems : {method: 'GET', url: 'equipment/equipmentitems/list/{pageNo}/{pageSize}'},
		saveEquipmentItem : {method: 'POST', url: 'equipment/{id}/equipmentitem'},
		removeEquipmentItems : _.extend({method: 'DELETE', url: 'equipment/{id}/equipmentitems'}, apiCfg.delCfg),
		updateEquipmentItem : {method: 'PUT', url: 'equipment/{id}/equipmentitem'},
        checkScrap: {method: 'GET', url: 'equipment/checkScrap'},
//		update : {method: 'PUT', url: 'equipment'},
        getTypeList: {method: 'GET', url: "equipmenttype/list?disable=0"}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("equipment"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        create: '2010004001',
        'import': '2010004004',
        edit: '2010004002',
        'delete': '2010004003',
        'export':'2010004005'
    };
    return resource;
});