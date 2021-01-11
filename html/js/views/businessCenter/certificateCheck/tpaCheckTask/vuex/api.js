define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getEnvconfig: {method: 'GET', url: 'envconfig/{type}'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("tpachecktask"));
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});