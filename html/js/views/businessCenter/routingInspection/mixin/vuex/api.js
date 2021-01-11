define(function(require){

    var Vue = require("vue");

    var customActions = {
        getUndoCount: {method: 'GET', url: 'richecktable/todo/num'}
    };

    var resource = Vue.resource(null,{}, customActions);

    return resource;
});