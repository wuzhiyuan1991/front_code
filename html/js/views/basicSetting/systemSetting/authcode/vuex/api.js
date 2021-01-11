define(function (require) {

    var Vue = require("vue");

    var customActions = {
        list:{method:"GET", url: 'authoritySetting/list'},
        init:{method: 'POST',url: 'authoritySetting/init'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},
    };

    var resource = Vue.resource(null, {}, customActions);
    return resource;
});