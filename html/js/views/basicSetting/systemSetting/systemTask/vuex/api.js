define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");
    var customActions = {
        getCustomLookupData: {method: 'GET', url: 'lookup/lookupitems/list?code=system_task_setting'},
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("taskcallback"));
    var resource = Vue.resource(null, {}, customActions);
    return resource;
});