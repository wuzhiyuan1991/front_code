define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        queryOpts : {method: 'GET', url: 'question/opts/list'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("errorrecord"));
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});