define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");
    var customActions = {
        update: {method: 'PUT', url: 'logback'},
    };
    // customActions = _.defaults(customActions, apiCfg.buildDefaultApi("i18n"));
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});