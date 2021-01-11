define(function(require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getTreeData: { method: 'GET', url: 'audittask/treeList/{id}?types={types}' },
        getStatisticsData: { method: 'GET', url: 'auditplan/statis?id={id}'},
        listRating: { method: 'GET', url: 'auditRating/list?auditPlan.id={id}' },
        getRating: { method: 'GET', url: 'auditRating/{id}'},
        createRating: { method: 'POST', url: 'auditRating'},
        updateRating: { method: 'PUT', url: 'auditRating'},
        removeRating: { method: 'DELETE', url: 'auditRating'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("auditplan"));
    var resource = Vue.resource(null, {}, customActions);
    resource.__auth__ = {
        'view': '6010004001'
    };
    return resource;
});
