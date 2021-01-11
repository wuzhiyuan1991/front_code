define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {

        updateDisable : {method: 'PUT', url: 'ptwjsareference/disable'},

        queryPtwJsaReferenceDetails : {method: 'GET', url: 'ptwjsareference/ptwjsareferencedetails/list'},
        savePtwJsaReferenceDetail : {method: 'POST', url: 'ptwjsareference/{id}/ptwjsareferencedetail'},
        removePtwJsaReferenceDetails : _.extend({method: 'DELETE', url: 'ptwjsareference/{id}/ptwjsareferencedetails'}, apiCfg.delCfg),
        updatePtwJsaReferenceDetail : {method: 'PUT', url: 'ptwjsareference/{id}/ptwjsareferencedetail'},
        movePtwJsaReferenceDetails : {method: 'PUT', url: 'ptwjsareference/{id}/ptwjsareferencedetails/order'},
        updateSubmit:{method:'PUT',url:'ptwjsareference/submit'},

    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("ptwjsareference"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '7040002001',
        'edit':   '7040002002',
        'delete': '7040002003',
        'import': '7040002004',
        'export': '7040002005',
        'enable': '7040002006',
        'copy': '7040002007',
        'exportDetail':'7040002013'
        // 'submit': '7040002012',
    };
    return resource;
});