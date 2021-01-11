define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        removeSingle : _.extend({method: 'DELETE', url: 'ptwcatalog'}, apiCfg.delCfg),
        createBatch : {method: 'POST', url: 'ptwcatalog/batch'},//入参为ptwcatalog对象数组
		updateDisable : {method: 'PUT', url: 'ptwcatalog/disable'},
        order : {method: 'PUT', url: 'ptwcatalog/order'},
        removeAll : _.extend({method: 'DELETE', url: 'ptwcatalog/{type}'}, apiCfg.delCfg),
        list : {method: 'GET', url: 'ptwcatalog/list'},

        removeVarious:{method:'DELETE', url:'ptwcatalog/ids'},
        updateLookupItem : {method: 'PUT', url: 'lookup/{id}/lookupitem'},
        queryLookupItem:{method: 'GET', url: '/lookup/ptw_param/lookupitem/enableGasStandard/?type=syscfg&_bizModule=code'},

        queryPtwWorkRoles:{method: 'GET', url: 'ptwworkrole/list/1/10000'},
        createPtwWorkRoles: {method: 'POST', url: 'ptwworkrole/batch'},
        removePtwWorkRole:{method:'DELETE', url:'ptwworkrole/{id}'},
        updatePtwWorkRoleStatus: {method: 'PUT', url: 'systembusinessset/saveBusinessSet'},
        querySystemParam: {method: 'GET', url: 'systembusinessset/root'},

        queryWorkcatalogtree: {method: 'GET', url: 'ptwcatalog/workcatalogtree'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("ptwcatalog"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
         'create': '7050001001',
         'edit':   '7050001002',
         'delete': '7050001003',
    };
    return _.extend({},resource,{
        getWorkCatalogLevelList: function(workCatalogId){
            resource.list({
                type:2,
                parentId:workCatalogId,
            }).then(function(res){
                return  res.data;
            })
        }
    });
});