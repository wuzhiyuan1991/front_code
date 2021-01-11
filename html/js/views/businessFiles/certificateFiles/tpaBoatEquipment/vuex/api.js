define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		queryTpaBoatEquipmentItems : {method: 'GET', url: 'tpaboatequipment/tpaboatequipmentitems/list/{pageNo}/{pageSize}'},
		saveTpaBoatEquipmentItem : {method: 'POST', url: 'tpaboatequipment/{id}/tpaboatequipmentitem'},
		removeTpaBoatEquipmentItems : _.extend({method: 'DELETE', url: 'tpaboatequipment/{id}/tpaboatequipmentitems'}, apiCfg.delCfg),
		updateTpaBoatEquipmentItem : {method: 'PUT', url: 'tpaboatequipment/{id}/tpaboatequipmentitem'},
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("tpaboatequipment"));
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});