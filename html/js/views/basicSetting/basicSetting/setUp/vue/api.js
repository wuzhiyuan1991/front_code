define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");
    var customActions = {
        //get: {method: 'GET', url: 'group'},
        getIndustry: {method: 'GET', url: 'group/industry'},
        getRegion: {method: 'GET', url: 'group/region'},
        //create: {method: 'POST', url: 'group'},
        //update: {method: 'PUT', url: 'group'}
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("group"));
    var resource = Vue.resource(null, {}, customActions);
    return resource;
});