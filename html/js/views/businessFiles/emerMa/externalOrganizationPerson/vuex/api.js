define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {

    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("emerlinkman"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
         'export': '9020003005',
    };
    return resource;
});