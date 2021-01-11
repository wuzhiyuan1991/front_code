define(function(require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getTreeData: { method: 'GET', url: 'isaaudittask/treeList/{id}?types={types}' },
        getStatisticsData: { method: 'GET', url: 'isaauditplan/statis?id={id}'},
        listRating: { method: 'GET', url: 'isaauditrating/list?auditPlan.id={id}' },
        getRating: { method: 'GET', url: 'isaauditrating/{id}'},
        createRating: { method: 'POST', url: 'isaauditrating'},
        updateRating: { method: 'PUT', url: 'isaauditrating'},
        removeRating: { method: 'DELETE', url: 'isaauditrating'},
        getElements: { method: 'GET', url: 'isaauditelement/list'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("isaauditplan"));
    var resource = Vue.resource(null, {}, customActions);
    resource.__auth__ = {
        'view': '6030004001',
        'preview': '6030004007'
    };
    return resource;
});
