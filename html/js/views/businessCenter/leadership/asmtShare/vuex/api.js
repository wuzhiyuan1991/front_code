define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("asmtshare"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'delete': '8010003003'
    };
    return resource;
});