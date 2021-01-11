define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        //list : {method: 'GET', url: 'riskassessment/list/{pageNo}/{pageSize}'},
        //get : {method: 'GET', url: 'riskassessment/{id}'},
        //create : {method: 'POST', url: 'riskassessment'},
        //update : {method: 'PUT', url: 'riskassessment'},
        //remove : _.extend({method: 'DELETE', url: 'riskassessment'}, apiCfg.delCfg),
        //exportExcel : {method: 'GET', url: 'riskassessment/exportExcel'},
        //importExcel : {method: 'POST', url: 'riskassessment/importExcel'},

        saveCheckMethods : {method: 'POST', url: 'checkitem/{id}/checkmethods'},
        saveCheckBasis : {method: 'POST', url: 'checkitem/{id}/checkbases'},
        saveAccident : {method: 'POST', url: 'checkitem/{id}/accidentcases'},
        removeCheckMethods : _.extend({method: 'DELETE', url: 'checkitem/{id}/checkmethods'}, apiCfg.delCfg),
        removeCheckBasis : _.extend({method: 'DELETE', url: 'checkitem/{id}/checkbases'}, apiCfg.delCfg),
        removeAccidentCase : _.extend({method: 'DELETE', url: 'checkitem/{id}/accidentcases'}, apiCfg.delCfg),
        listTableType:{method:'GET',url:'risktype/list'},

        getUUID: {method: 'GET', url: 'helper/getUUID'},
        getRiskType:{method:'GET',url:'risktype/list'},
        getCheckItemRiskType: {method: 'GET', url: 'checkitem/itemtypes'},

        auditPending:{method:'PUT',url:'riskassessment/audit/pending'},
        auditRejected:{method:'PUT',url:'riskassessment/audit/rejected'},
        auditPassed:{method:'PUT',url:'riskassessment/audit/passed'},
        getRiskModel:{method:'GET',url:'riskmodel/levels/list'},
        getHazardFactor:{method:'GET',url:'hazardfactor/list'},
        getDominationAreaList: {method: 'GET', url: 'dominationarea/list/1/1?criteria.orderValue.fieldName=modifyDate&criteria.orderValue.orderType=1&disable=0&orgId={orgId}'},
        saveLegalregulations:{method: 'POST', url: 'checkitem/{id}/legalregulations'},
        removeLegalregulation:_.extend({method: 'DELETE', url: 'checkitem/{id}/legalregulation'}, apiCfg.delCfg)
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("riskassessment"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '3010001001',
        'edit': '3010001002',
        'delete': '3010001003',
        'audit': '3010001004',
        'notAudit': '3010001005',
        'import':'3010001006'
    };
    return resource;
});