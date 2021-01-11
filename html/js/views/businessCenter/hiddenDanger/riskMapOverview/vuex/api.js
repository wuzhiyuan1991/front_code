define(function(require){

    var Vue = require("vue");
    var customActions = {
        get: {method: 'GET', url: 'riskstatic/global/map'},
        getSetting: {method: 'GET', url: 'lookup/{code}/lookupitem/{lookupitemCode}?_bizModule=code'},
        updateSetting: {method: 'PUT', url: 'lookupitem'}
    };
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {

    };
    return resource;
});