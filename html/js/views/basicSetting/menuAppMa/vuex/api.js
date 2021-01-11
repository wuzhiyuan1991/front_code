define(function (require) {

    var Vue = require("vue");

    var customActions = {
        list:{method:"GET", url: 'appmenu/list?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0'},
        update:{method: 'PUT',url: 'appmenu'},
        add:{method: 'POST',url: 'appmenu'},
        del:{method: 'DELETE',url: 'appmenu'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},
        removeAllCache : {method: 'DELETE', url: 'cache/all'}
    };

    var resource = Vue.resource(null, {}, customActions);
    return resource;
});