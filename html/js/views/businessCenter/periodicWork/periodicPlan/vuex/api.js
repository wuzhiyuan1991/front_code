define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        create : {method: 'POST', url: 'checkplan?_bizModule=xbgd'},
		queryCheckTasks : {method: 'GET', url: 'checkplan/checktasks/list/{pageNo}/{pageSize}'},
		preViewCheckTasks :{method: 'GET', url: 'checkplan/checktasks/view/{pageNo}/{pageSize}'},
		saveCheckTask : {method: 'POST', url: 'checkplan/{id}/checktask'},
		removeCheckTasks : _.extend({method: 'DELETE', url: 'checkplan/{id}/checktasks'}, apiCfg.delCfg),
		updateCheckTask : {method: 'PUT', url: 'checkplan/{id}/checktask'},
		queryCheckRecords : {method: 'GET', url: 'checkplan/checkrecords/list/{pageNo}/{pageSize}'},
		saveCheckRecord : {method: 'POST', url: 'checkplan/{id}/checkrecord'},
		removeCheckRecords : _.extend({method: 'DELETE', url: 'checkplan/{id}/checkrecords'}, apiCfg.delCfg),
		updateCheckRecord : {method: 'PUT', url: 'checkplan/{id}/checkrecord'},
		queryUsers : {method: 'GET', url: 'checkplan/users/list/{pageNo}/{pageSize}'},
		saveUsers : {method: 'POST', url: 'checkplan/{id}/users'},
		removeUsers : _.extend({method: 'DELETE', url: 'checkplan/{id}/users'}, apiCfg.delCfg),
        publish: {method: 'PUT', url: 'checkplan/publish'},
        invalid: {method: 'PUT', url: 'checkplan/invalid'},
        getUsers:{method:'GET',url:'checkplan/users/list'},
        getCheckers:{method:'GET',url:'checkplan/checkers/list'},
        getUser:{method:'GET',url:'user/{id}'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},
        getEnvconfig: {method: 'GET', url: 'envconfig/{type}'},
        getCheckRecords: {method: 'GET', url: 'checkrecord/list'},
        getCheckTaskConfig: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=checkTaskSet\.isLateCheckAllowed'},

        saveTask: {method: 'POST', url: 'checkplan/{id}/checktables'}, // 保存检查任务
        delTask: {method: 'DELETE', url: 'checkplan/{id}/checktables'},  // 删除检查任务

        getDominationArea: {method: 'GET', url: 'dominationarea/list'},
        getEquipment: {method: 'GET', url: 'equipment/list'},
        getMajorRiskSource: {method: 'GET', url: 'majorrisksource/list'},
        getMajorChemicalProcess: {method: 'GET', url: 'majorchemicalprocess/list'},
        getMajorChemicalObj: {method: 'GET', url: 'majorchemicalobj/list'},
        getCheckTableByCheckObj: {method: 'GET', url: 'checktable/list/{checkObjectId}'},

        getEquipmentType: {method: 'GET', url: 'equipmenttype/isDataReferencedList'},
        getChemicalType: {method: 'GET', url: 'checkobjectcatalog/baseChemicalObj/treeList'},
        getProcessType: {method: 'GET', url: 'checkobjectcatalog/majorChemicalProcess/treeList'},
        getDominationAreaList: {method: 'GET', url: 'dominationarea/list/1/1?criteria.orderValue.fieldName=modifyDate&criteria.orderValue.orderType=1&disable=0&orgId={orgId}'},
        getBusinessset: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=checkTaskSet\.isIcpeTimeSettingAllowedToCrossAnother'},
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("checkplan"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2020001001',
        'edit': '2020001002',
        'delete': '2020001003',
        'publish': '2020001201',
        'invalid': '2020001202',
        'copy': '2020001010',
    };
    return resource;
});