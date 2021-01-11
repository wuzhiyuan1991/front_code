define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		queryTpaEquipmentItems : {method: 'GET', url: 'tpaequipment/tpaequipmentitems/list/{pageNo}/{pageSize}'},
		saveTpaEquipmentItem : {method: 'POST', url: 'tpaequipment/{id}/tpaequipmentitem'},
		removeTpaEquipmentItems : _.extend({method: 'DELETE', url: 'tpaequipment/{id}/tpaequipmentitems'}, apiCfg.delCfg),
		updateTpaEquipmentItem : {method: 'PUT', url: 'tpaequipment/{id}/tpaequipmentitem'},
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("tpaequipment"));
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});