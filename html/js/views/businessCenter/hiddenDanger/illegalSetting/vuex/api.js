define(function(require){

    var Vue = require("vue");
	var apiCfg = require("apiCfg");
	var customActions = {
        batch: {method: 'POST', url: 'tableillegalsetting/batch'},
    };
	customActions = _.defaults(customActions, apiCfg.buildDefaultApi("tableillegalsetting"));
	var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
    };
    return resource;
});