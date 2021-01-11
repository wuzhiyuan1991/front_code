define(function (require) {

    var Vue = require("vue");

    var customActions = {
        //检查表分类
        collect: {method: 'GET', url: 'collect/list'},
        createCollect: {method: 'POST', url: 'collect/batch'},
        delCollect: {method: 'DELETE', url: 'collect/ids'},
    };

    var resource = Vue.resource(null, {}, customActions);
    return resource;
});