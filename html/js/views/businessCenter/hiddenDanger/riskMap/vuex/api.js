http://192.168.0.232:23219/
    define(function(require){

        var Vue = require("vue");
        var customActions = {
            getId: { method: 'GET', url: 'lookup/list/1/20?code=risk_map_setting'},
            getItem: {method: 'GET', url: 'lookup/lookupitems/list/1/10?id=eze2717m77'},
            getSetting: {method: 'GET', url: 'lookup/{id}/lookupitem/{settingId}'},
            save: {method: 'PUT', url: 'lookup/{id}/lookupitem'}
        };
        var resource = Vue.resource(null,{}, customActions);
        resource.__auth__ = {

        };
        return resource;
    });