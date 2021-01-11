define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getTypeList: {method: 'GET', url: "equipmenttype/list?disable=0"},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("equipmenttype"));
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});