define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        list: {method: 'GET', url: 'opcardsharedfile/list/1/9999'},
        order: {method: 'PUT', url: 'opcardsharedfile/order'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("opcardsharedfile"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '9720002001',
        'edit':   '9720002002',
        'delete': '9720002003'
    };
    return resource;
});