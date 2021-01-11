define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("asmtbasis"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '8020003001',
        'edit': '8020003002',
        'delete': '8020003003',
        'export':'8020003005'
    };
    return resource;
});