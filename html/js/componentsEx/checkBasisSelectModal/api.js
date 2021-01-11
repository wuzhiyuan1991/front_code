define(function(require) {

    var Vue = require("vue");

    var customActions = {
        queryLegalTypes: {method: 'GET', url: 'legalregulationtype/list/1/9999'},

    };
    var resource = Vue.resource(null, {}, customActions);

    return resource;
});