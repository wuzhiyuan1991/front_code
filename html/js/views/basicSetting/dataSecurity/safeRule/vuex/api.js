define(function (require) {

    var Vue = require("vue");

    var customActions = {
         reset:{method:'PUT',url:'user/reset/admin/pwd'},
         update: {method: 'PUT', url: 'envconfig'},
         get: {method: 'GET', url: 'envconfig/{type}'},
         save:{method:'POST',url:'envconfig'}
    };

    var resource = Vue.resource(null, {}, customActions);
    return resource;
});