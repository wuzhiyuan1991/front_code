define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        listCheckObjectCatalogClassify: {method: 'GET', url: 'checkobjectcatalogclassify/list'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("checkobjectcatalog/baseChemicalObj"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2010010001',
        'edit': '2010010002',
        'delete': '2010010003',
        'import': '2010010004',
         'export': '2010010005'
    };
    return resource;
});