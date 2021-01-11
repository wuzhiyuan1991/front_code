define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
    	publish : {method: 'PUT', url: 'pushnotice/pub'},
		queryUsers : {method: 'GET', url: 'pushnotice/users/list/{pageNo}/{pageSize}'},
		saveUsers : {method: 'POST', url: 'pushnotice/{id}/users'},
		removeUsers : _.extend({method: 'DELETE', url: 'pushnotice/{id}/users'}, apiCfg.delCfg),
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("pushnotice"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '1050001001',
        'edit': '2010002002',
        'delete': '2010002003',
        "export":"1050001005"
    };
    return resource;
});