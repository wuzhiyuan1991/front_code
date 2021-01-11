define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		queryCheckMethods : {method: 'GET', url: 'checkitem/checkmethods/list/{pageNo}/{pageSize}'},
		saveCheckMethods : {method: 'POST', url: 'checkitem/{id}/checkmethods'},
        createCheckMethod : {method: 'POST', url: 'checkitem/{id}/checkmethod'},
        saveCheckBasis : {method: 'POST', url: 'checkitem/{id}/checkbases'},
        saveAccident : {method: 'POST', url: 'checkitem/{id}/accidentcases'},
        createAccidentCase : {method: 'POST', url: 'checkitem/{id}/accidentcase'},
        createCheckBasis: {method: 'POST', url: 'checkitem/{id}/legalRegulation'},
        removeCheckMethods : _.extend({method: 'DELETE', url: 'checkitem/{id}/checkmethods'}, apiCfg.delCfg),
        removeCheckBasis : _.extend({method: 'DELETE', url: 'checkitem/{id}/checkbases'}, apiCfg.delCfg),
        removeAccidentCase : _.extend({method: 'DELETE', url: 'checkitem/{id}/accidentcases'}, apiCfg.delCfg),
        removeEquipment : _.extend({method: 'DELETE', url: 'checkitem/{id}/equipments'}, apiCfg.delCfg),
        updateDisable:{method:'PUT',url:'checkitem/disable'},
        listTableType:{method:'GET',url:'risktype/list'},
        _deleteExpertSupport:{method: 'DELETE',url:'checkitem/deleteExpertSupport'},
        saveLegalregulations:{method: 'POST', url: 'checkitem/{id}/legalregulations'},
        removeLegalregulation:_.extend({method: 'DELETE', url: 'checkitem/{id}/legalregulation'}, apiCfg.delCfg),
        getUUID: {method: 'GET', url: 'helper/getUUID'},
        queryLegalTypes: {method: 'GET', url: 'legalregulationtype/list/1/9999'},

        updateAccidentcase:{method: 'PUT',url:'accidentcase'},
        updateCheckMethod:{method: 'PUT',url:'checkmethod'},
        updateLegalregulation:{method: 'PUT',url:'legalregulation'},
        getRiskAssessment:{method:'GET',url:'riskassessment/{id}'},
        getRiskIdentification:{method:'GET',url:'riskidentification/{id}'},
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("checkitem"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        create: '2010002001',
        'import': '2010002004',
        'export': '2010002005',
        edit: '2010002002',
        'delete': '2010002003',
        enable: '2010002021',
        'riskinfo':'2010002010'
    };
    return resource;
});