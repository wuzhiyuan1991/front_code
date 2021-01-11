define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        share: {method: 'PUT', url: 'ewcardtpl/share'},
        queryEwworkitem : {method: 'GET', url: 'ewcardtpl/ewcarditems/list/1/1000'},
        createEwworkitem : {method: 'POST', url: 'ewcardtpl/{id}/ewcarditem'},
        delEwworkitem : {method: 'DELETE', url: 'ewcardtpl/{id}/ewcarditems'},
        updateEwworkitem : {method: 'PUT', url: 'ewcardtpl/{id}/ewcarditem'},
        moveEwWorkItems : {method: 'PUT', url: 'ewcardtpl/{id}/ewcarditems/order'},

        submitEwworkcard : {method: 'PUT', url: 'ewcardtpl/submit'},

    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("ewcardtpl"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2610001001',
        'edit':   '2610001002',
        'delete': '2610001003',
        'enable':'2610001006',
        'copy':'2610001007',
        'share':'2610001008',
        //'import':'2610001004',
        //'export':'2610001005',
    };
    return resource;
});