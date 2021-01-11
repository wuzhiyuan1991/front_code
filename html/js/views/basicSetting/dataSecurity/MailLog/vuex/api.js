define(function(require){

    var Vue = require("vue");

    var customActions = {
        list: {method: 'GET', url: 'logmail/list{/curPage}{/pageSize}'}
    };
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});