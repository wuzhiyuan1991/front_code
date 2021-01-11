define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getCheckTable: {method: 'GET', url: 'tpachecktable/{id}'},
        getEnvConfig:{method:'GET',url:'envconfig/{type}'},
        getCheckTask: {method: 'GET', url: 'tpachecktask/{id}'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("tpacheckrecord"));
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});