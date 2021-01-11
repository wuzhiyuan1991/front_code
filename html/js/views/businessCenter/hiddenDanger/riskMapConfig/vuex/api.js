define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        updateDisable: {method: 'PUT', url: 'dominationarea/updateDisable'},
        updateTableobjectrel: {method: 'PUT', url: 'tableobjectrel'},
        createTableobjectrel: {method: 'POST', url: 'tableobjectrel/batch'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("dominationarea"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2010005001',
        'edit': '2010005002',
        'delete': '2010005003',
        'import': '2010005004',
        'export': '2010005005',
        'enable': '2010005006',
        'copy':'2010005010'
    };
    return resource;
});