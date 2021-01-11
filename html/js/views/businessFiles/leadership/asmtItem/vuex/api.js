define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("asmtitem"));
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});