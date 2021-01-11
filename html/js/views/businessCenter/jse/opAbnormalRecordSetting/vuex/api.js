define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");
    var customActions = {
        get: {method: 'GET', url: 'envconfig/{type}'},
        //update: {method: 'PUT', url: 'envconfig'},
        //deleteFile:{method:'DELETE',url:'file'},
        save:{method:'POST',url:'envconfig'},
        getCheckTables: {method: 'GET', url: 'checktable/list/1/9999'},
        getParameters: {method: 'GET', url: 'systembusinessset/root'},
        saveBusinessSet: {method: 'PUT', url: 'systembusinessset/saveBusinessSet'},
        getParameterDetail: {method: 'GET', url: 'systembusinesssetdetail/list/{curPage}/{pageSize}'},
        addParameterDetail: {method: 'POST', url: 'systembusinesssetdetail'},
        deleteParameterDetail: {method: 'DELETE', url: 'systembusinesssetdetail'},
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("envconfig"));
    var resource = Vue.resource(null, {}, customActions);
    return resource;
});