define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        create4copy: {method: 'PUT', url: 'ewcardtpl/{id}/copy'}, // 复制
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("ewcardtpl"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'copy':'2610003007',
    };
    return resource;
});