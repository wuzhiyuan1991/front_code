define(function(require){

    var Vue = require("vue");

    var customActions = {
        getEquipmentType: {method: 'GET', url: 'equipmenttype/list'},
        getChemicalType: {method: 'GET', url: 'checkobjectcatalog/baseChemicalObj/treeList'},
        getProcessType: {method: 'GET', url: 'checkobjectcatalog/majorChemicalProcess/list'}
    };

    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {

    };
    return resource;
});