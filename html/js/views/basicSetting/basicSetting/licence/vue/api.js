define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");
    var customActions = {
        //get: {method: 'GET', url: 'licence'},
        post:{method:'POST', url:'login'}
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("licence"));
    var resource = Vue.resource(null, {}, customActions);
    return resource;
});