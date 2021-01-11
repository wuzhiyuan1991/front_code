define(function (require) {

    var Vue = require("vue");

    var customActions = {
        list:{method:"GET", url: 'menu/list'},
        update:{method: 'PUT',url: 'menu'},
        add:{method: 'POST',url: 'menu'},
        del:{method: 'DELETE',url: 'menu'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},
        removeAllCache : {method: 'DELETE', url: 'cache/all'}
    };

    var resource = Vue.resource(null, {}, customActions);
    return resource;
});