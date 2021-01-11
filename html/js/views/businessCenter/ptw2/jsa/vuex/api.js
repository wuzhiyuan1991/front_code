define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'ptwjsamaster/disable'},

		queryPtwJsaDetails : {method: 'GET', url: 'ptwjsamaster/ptwjsadetails/list'},
		savePtwJsaDetail : {method: 'POST', url: 'ptwjsamaster/{id}/ptwjsadetail'},
		removePtwJsaDetails : _.extend({method: 'DELETE', url: 'ptwjsamaster/{id}/ptwjsadetails'}, apiCfg.delCfg),
		updatePtwJsaDetail : {method: 'PUT', url: 'ptwjsamaster/{id}/ptwjsadetail'},
		movePtwJsaDetails : {method: 'PUT', url: 'ptwjsamaster/{id}/ptwjsadetails/order'},
        updateShare:{method:'PUT',url:'ptwjsamaster/share'},
        updateSubmit:{method:'PUT',url:'ptwjsamaster/submit'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("ptwjsamaster"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '7040001001',
        'edit':   '7040001002',
        'delete': '7040001003',
        'import': '7040001004',
        'export': '7040001005',
        // 'enable': '7040001006',
        'copy': '7040001007',
        // 'share': '7040001011',
        'submit': '7040001012',
        'exportDetail':'7040001013'

    };
    return resource;
});