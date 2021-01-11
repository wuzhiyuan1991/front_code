define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        updateDisable : {method: 'PUT', url: 'changemanagement/disable'},

        queryCultivateRecords : {method: 'GET', url: 'changemanagement/cultivaterecords/list/{pageNo}/{pageSize}'},
        saveCultivateRecord : {method: 'POST', url: 'changemanagement/{id}/cultivaterecord'},
        removeCultivateRecords : _.extend({method: 'DELETE', url: 'changemanagement/{id}/cultivaterecords'}, apiCfg.delCfg),
        updateCultivateRecord : {method: 'PUT', url: 'changemanagement/{id}/cultivaterecord'},

        queryPassOpinions : {method: 'GET', url: 'changemanagement/passopinions/list/{pageNo}/{pageSize}'},
        savePassOpinion : {method: 'POST', url: 'changemanagement/{id}/passopinion'},
        removePassOpinions : _.extend({method: 'DELETE', url: 'changemanagement/{id}/passopinions'}, apiCfg.delCfg),
        updatePassOpinion : {method: 'PUT', url: 'changemanagement/{id}/passopinion'},
        
        // riskitemgroup/order      insertPointObjId

        saveRiskItem : {method: 'POST', url: 'riskitemgroup/{id}/riskitem'},
		removeRiskItems : _.extend({method: 'DELETE', url: 'riskitemgroup/{id}/riskitems'}, apiCfg.delCfg),
        updateRiskItem : {method: 'PUT', url: 'riskitemgroup/{id}/riskitem'},
        updateGroup : {method: 'PUT', url: 'riskitemgroup'},
        queryRiskItemGroups : {method: 'GET', url: 'changemanagement/riskitemgroups/list'},
        saveRiskItemGroup : {method: 'POST', url: 'changemanagement/{id}/riskitemgroup'},
        removeRiskItemGroups : _.extend({method: 'DELETE', url: 'changemanagement/{id}/riskitemgroups'}, apiCfg.delCfg),
        updateRiskItemGroup : {method: 'PUT', url: 'changemanagement/{id}/riskitemgroup'},
       
        saveOpinions : {method: 'POST', url: 'changemanagement/passopinions'},
        queryHandlers : {method: 'GET', url: 'changemanagement/handlers/list/{pageNo}/{pageSize}'},
        saveHandlers : {method: 'POST', url: 'changemanagement/{id}/handlers'},
        removeHandlers : _.extend({method: 'DELETE', url: 'changemanagement/{id}/handlers'}, apiCfg.delCfg),

        queryApprovers : {method: 'GET', url: 'changemanagement/approvers/list/1/2000'},
        saveApprovers : {method: 'POST', url: 'changemanagement/{id}/approvers'},
        removeApprovers : _.extend({method: 'DELETE', url: 'changemanagement/{id}/approvers'}, apiCfg.delCfg),

        queryAssessors : {method: 'GET', url: 'changemanagement/assessors/list/{pageNo}/{pageSize}'},
        saveAssessors : {method: 'POST', url: 'changemanagement/{id}/assessors'},
        removeAssessors : _.extend({method: 'DELETE', url: 'changemanagement/{id}/assessors'}, apiCfg.delCfg),

        queryTrainers : {method: 'GET', url: 'changemanagement/trainers/list/{pageNo}/{pageSize}'},
        saveTrainers : {method: 'POST', url: 'changemanagement/{id}/trainers'},
        removeTrainers : _.extend({method: 'DELETE', url: 'changemanagement/{id}/trainers'}, apiCfg.delCfg),

        queryAcceptors : {method: 'GET', url: 'changemanagement/acceptors/list/{pageNo}/{pageSize}'},
        saveAcceptors : {method: 'POST', url: 'changemanagement/{id}/acceptors'},
        removeAcceptors : _.extend({method: 'DELETE', url: 'changemanagement/{id}/acceptors'}, apiCfg.delCfg),
        
       

    };


    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("changemanagement"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '8210001001',
        // 'edit':   '8210001002',
        'delete': '8210001010',
        // 'import': '8210001004',
        // 'export': '8210001005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});