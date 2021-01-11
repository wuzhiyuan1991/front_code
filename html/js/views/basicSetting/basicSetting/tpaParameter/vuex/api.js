define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");
    var customActions = {
        get: {method: 'GET', url: 'envconfig/{type}'},
        //update: {method: 'PUT', url: 'envconfig'},
        //deleteFile:{method:'DELETE',url:'file'},
        save:{method:'POST',url:'envconfig'}
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("envconfig"));
    var resource = Vue.resource(null, {}, customActions);
    return resource;
});