define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        querylaws:{method:'GET',url:'laws/all/list/{currentPage}/{pageSize}'},
        querylawscontent:{method:'GET',url:'lawscontent/list/other/{currentPage}/{pageSize}'}
    };
    
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("laws"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
    };
    return resource;
});