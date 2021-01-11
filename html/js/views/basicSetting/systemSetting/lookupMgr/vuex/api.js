define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        //list : {method: 'GET', url: 'lookup/list/{pageNo}/{pageSize}'},
        //get : {method: 'GET', url: 'lookup/{id}'},
        //create : {method: 'POST', url: 'lookup'},
        //update : {method: 'PUT', url: 'lookup'},
        //remove : _.extend({method: 'DELETE', url: 'lookup/ids'}, apiCfg.delCfg),
        //exportExcel : {method: 'GET', url: 'lookup/exportExcel'},
        //importExcel : {method: 'POST', url: 'lookup/importExcel'},
		queryLookupItems : {method: 'GET', url: 'lookup/lookupitems/list/{pageNo}/{pageSize}'},
		saveLookupItem : {method: 'POST', url: 'lookup/{id}/lookupitem'},
		removeLookupItems : _.extend({method: 'DELETE', url: 'lookup/{id}/lookupitems'}, apiCfg.delCfg),
		updateLookupItem : {method: 'PUT', url: 'lookup/{id}/lookupitem'},

		removeCache : {method: 'DELETE', url: 'cache/name/{name}'},
		removeAllCache : {method: 'DELETE', url: 'cache/all'},
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("lookup"));
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});