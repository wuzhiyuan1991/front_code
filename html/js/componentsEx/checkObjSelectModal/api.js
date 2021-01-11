define(function(require){

    var Vue = require("vue");

    var customActions = {
        getEquipmentType: {method: 'GET', url: 'equipmenttype/isDataReferencedList'},
        getChemicalType: {method: 'GET', url: 'checkobjectcatalog/baseChemicalObj/treeList'},
        getProcessType: {method: 'GET', url: 'checkobjectcatalog/majorChemicalProcess/treeList'},
        getDominationAreaList: {method: 'GET', url: 'dominationarea/list/1/1?criteria.orderValue.fieldName=modifyDate&criteria.orderValue.orderType=1&disable=0&orgId={orgId}'}
    };

    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {

    };
    return resource;
});