define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getTreeData: { method: 'GET', url: 'isaauditelement/treeList/{id}?types={types}'},
        publish: { method: 'PUT', url: 'isaauditplan/publish'},

        queryAuditWeights : {method: 'GET', url: 'isaauditplan/auditweights/list'},
        saveAuditWeights: {method: 'POST', url:"isaauditplan/{id}/auditweights"}
    }

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("isaauditplan"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '6030001001',
        'edit': '6030001002',
        'delete': '6030001003',
        'publish': '6030001004',
        'copy': '6030001009',
        'setWeight':'6030001010'
    };
    return _.extend({},resource,{
        queryAuditWeights:function (pms) {
            return  resource.queryAuditWeights(pms).then(function (result) {
                var data=result.data;
                data.forEach(function (item) {
                    item.attr1=item.attr1==1;
                });
                return data;
            })
        }
    });



});