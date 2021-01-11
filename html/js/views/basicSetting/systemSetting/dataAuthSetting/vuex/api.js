define(function (require) {

    var Vue = require("vue");

    var customActions = {
        list:{method:"GET", url: 'dataAuthoritySetting/list'},
        update:{method: 'PUT',url: 'dataAuthoritySetting'},
        //create:{method: 'POST',url: 'dataAuthoritySetting'},
        add:{method: 'POST',url: 'dataAuthoritySetting'},
        del:{method: 'DELETE',url: 'dataAuthoritySetting'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},

    };

    var resource = Vue.resource(null, {}, customActions);
    return resource;
});