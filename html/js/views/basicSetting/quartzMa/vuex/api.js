define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
    		pause : {method: 'PUT', url: 'quartz/pause'},
    		resume : {method: 'PUT', url: 'quartz/resume'},
            _delete : {method: 'DELETE', url: 'quartz'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("quartz"));
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});