define(function (require) {

    var Vue = require("vue");

    var customActions = {
        list:{method:"GET", url: 'menu/list'},
        update:{method: 'PUT',url: 'menu/authority'},
        add:{method: 'POST',url: 'menu/authority'},
        del:{method: 'DELETE',url: 'menu/authority'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},

    };

    var resource = Vue.resource(null, {}, customActions);
    return resource;
});