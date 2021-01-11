define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'riskidentification/disable'},

		queryRiskIdentifiContMeasures : {method: 'GET', url: 'riskidentification/riskidentificontmeasures/list/{pageNo}/{pageSize}'},
		saveRiskIdentifiContMeasures : {method: 'POST', url: 'riskidentification/{id}/riskidentificontmeasures'},
		removeRiskIdentifiContMeasures : _.extend({method: 'DELETE', url: 'riskidentification/{id}/riskidentificontmeasures'}, apiCfg.delCfg),
		updateRiskIdentifiContMeasures : {method: 'PUT', url: 'riskidentification/{id}/riskidentificontmeasures'},

		queryRiskIdentificationEvals : {method: 'GET', url: 'riskidentification/riskidentificationevals/list/{pageNo}/{pageSize}'},
		saveRiskIdentificationEval : {method: 'POST', url: 'riskidentification/{id}/riskidentificationeval'},
		removeRiskIdentificationEvals : _.extend({method: 'DELETE', url: 'riskidentification/{id}/riskidentificationevals'}, apiCfg.delCfg),
		updateRiskIdentificationEval : {method: 'PUT', url: 'riskidentification/{id}/riskidentificationeval'},
        updateRiskLevel : {method: 'PUT', url: 'riskidentification/risklevel'},
        saveRiskAssess : {method: 'PUT', url: 'riskidentification/riskAssess'},
        queryEquipment : {method: 'GET', url: 'riskidentification/equipment/list/{pageNo}/{pageSize}'},
        saveEquipment : {method: 'POST', url: 'riskidentification/{id}/equipment'},
        removeEquipment : _.extend({method: 'DELETE', url: 'riskidentification/{id}/equipment'}, apiCfg.delCfg),
        getTypeList: {method: 'GET', url: "equipmenttype/list?disable=0"},
        listTableType:{method:'GET',url:'risktype/list'},
        getShowSpecialtyConfig: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=poolGovern.isShowSpecialty'},
        getEquipmentType: {method: 'GET', url: 'equipmenttype/isDataReferencedList'},
        getCheckTable: {method: 'GET', url: 'checktable/{id}'},
        getCheckPrinciple:{method:'GET', url:'checkprinciple/list/1/300'},
        saveCheckTableAndCheckItems:{method: 'POST', url: 'checktable/riskIdentifiContMeasures/{id}/checkitems'},
        listByTableNameAndAreaId:{method: 'GET', url: 'tableitemrel/listByTableNameAndAreaId'},
        selectMaxNo:{method: 'GET', url: 'riskidentification/maxNo/{prefix}'},
        selectEquipmentList:{method: 'GET', url: '/equipment/list'},

    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("riskidentification"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '3010002001',
        // 'edit':   '3010002002',
        // 'delete': '3010002003',
        // 'import': '3010002004',
        // 'export': '3010002005',
        // 'enable': '3010002006',
    };
    return resource;
});