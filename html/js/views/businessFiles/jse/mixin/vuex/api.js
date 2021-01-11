define(function(require){

    var Vue = require("vue");

    var customActions = {
        getUndoCount: {method: 'GET', url: 'opcard/todo/num'}
    };

    var resource = Vue.resource(null,{}, customActions);

    return resource;
});