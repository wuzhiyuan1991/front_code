define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("examschedule"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'export': '4010009005'
    };
    return resource;
});