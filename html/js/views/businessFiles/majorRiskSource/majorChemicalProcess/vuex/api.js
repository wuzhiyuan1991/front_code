define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        updateDisable: {method: 'PUT', url: 'majorchemicalprocess/updateDisable'},
        addEquipment: {method: 'POST', url: 'majorchemicalprocess/{id}/equipments'},
        removeEquipment: {method: 'DELETE', url: 'majorchemicalprocess/{id}/equipments'},
        listCheckObjectCatalog: {method: 'GET', url: 'checkobjectcatalog/majorChemicalProcess/list'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("majorchemicalprocess"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2010006001',
        'edit': '2010006002',
        'delete': '2010006003',
        'import': '2010006004',
        'export': '2010006005',
        'enable': '2010006006'
    };
    return resource;
});