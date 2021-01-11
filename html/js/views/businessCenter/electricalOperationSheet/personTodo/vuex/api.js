define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        queryEwworkitem : {method: 'GET', url: 'ewworkcard/ewworkitems/list/1/1000'},
        createEwworkitem : {method: 'POST', url: 'ewworkcard/{id}/ewworkitem'},
        delEwworkitem : {method: 'DELETE', url: 'ewworkcard/{id}/ewworkitems'},
        updateEwworkitem : {method: 'PUT', url: 'ewworkcard/{id}/ewworkitem'},
        moveEwWorkItems : {method: 'PUT', url: 'ewworkcard/{id}/ewworkitems/order'},

        submitEwworkcard : {method: 'PUT', url: 'ewworkcard/submit'},
        signEwworkcard: {method: 'PUT', url: 'ewworkcard/sign'},
        handoverEwworkcard: {method: 'PUT', url: 'ewworkcard/handover'},

        queryEwcardtpl: {method: 'GET', url: 'ewcardtpl/{id}'},

        getUUID: {method: 'GET', url: 'helper/getUUID'},

    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("ewworkcard"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2620001001',
        'edit':   '2620001002',
        'delete': '2620001003',
        'submit':'2620001008',
        'sign':'2620001009',
        'handover':'2620001010',

        //'import':'2620001004',
        //'export':'2620001005',
    };
    return resource;
});