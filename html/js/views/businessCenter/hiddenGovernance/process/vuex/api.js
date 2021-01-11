define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getUUID: {method: 'GET', url: 'helper/getUUID'},

        //list : {method: 'GET', url: 'activitiprocess/list/{pageNo}/{pageSize}'},
        //get : {method: 'GET', url: 'activitiprocess/{id}'},
        //create : {method: 'POST', url: 'activitiprocess'},
        //update : {method: 'PUT', url: 'activitiprocess'},
        //remove : _.extend({method: 'DELETE', url: 'activitiprocess/ids'}, apiCfg.delCfg),
        //exportExcel : {method: 'GET', url: 'activitiprocess/exportExcel'},
        //importExcel : {method: 'POST', url: 'activitiprocess/importExcel'},

        /*********************流程角色***************************/
        saveBatchFilterLookup:{method:'POST',url:'filterlookup/batch'},
        updateFilterLookup:{method:'PUT',url:'filterlookup'},
        updateFilterLookupDisableBatch:{method:'PUT',url:'filterlookup/updateDisableBatch'},
        deleteFilterLookup:{method:'DELETE',url:'filterlookup'},
        /*********************过滤条件***************************/
        listLookupItem:{method: 'GET', url: 'remind/lookupItem'},
        saveFilterConditions:{method:'POST',url:'filtercondition/batch'},
        delFilterConditions:{method:'DELETE',url:'filtercondition'},

        checkIsProcessRoleCrossComp: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=poolGovern.isProcessRoleCrossComp'},
        removeDefaultApproval:{method:'DELETE',url:'pooldefaultapproval'},
        saveDefaultApproval:{method:'POST',url:'pooldefaultapproval/batch'},
        getDefaultApproval:{method:'GET',url:'pooldefaultapproval/list/{curPage}/{pageSize}'},

       
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("activitiprocess"));
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});