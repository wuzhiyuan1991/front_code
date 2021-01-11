define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		queryCheckTasks : {method: 'GET', url: 'ritmpcheckplan/checktasks/list/{pageNo}/{pageSize}'},
		preViewCheckTasks :{method: 'GET', url: 'ritmpcheckplan/checktasks/view/{pageNo}/{pageSize}'},
		saveCheckTask : {method: 'POST', url: 'ritmpcheckplan/{id}/checktask'},
		removeCheckTasks : _.extend({method: 'DELETE', url: 'ritmpcheckplan/{id}/checktasks'}, apiCfg.delCfg),
		updateCheckTask : {method: 'PUT', url: 'ritmpcheckplan/{id}/checktask'},
		queryCheckRecords : {method: 'GET', url: 'ritmpcheckplan/checkrecords/list/{pageNo}/{pageSize}'},
		saveCheckRecord : {method: 'POST', url: 'ritmpcheckplan/{id}/checkrecord'},
		removeCheckRecords : _.extend({method: 'DELETE', url: 'ritmpcheckplan/{id}/checkrecords'}, apiCfg.delCfg),
		updateCheckRecord : {method: 'PUT', url: 'ritmpcheckplan/{id}/checkrecord'},
		queryUsers : {method: 'GET', url: 'ritmpcheckplan/users/list/{pageNo}/{pageSize}'},
		saveUsers : {method: 'POST', url: 'ritmpcheckplan/{id}/users'},
		removeUsers : _.extend({method: 'DELETE', url: 'ritmpcheckplan/{id}/users'}, apiCfg.delCfg),
        publish: {method: 'PUT', url: 'ritmpcheckplan/publish'},
        invalid: {method: 'PUT', url: 'ritmpcheckplan/invalid'},
        getUsers:{method:'GET',url:'ritmpcheckplan/users/list'},
        getCheckers:{method:'GET',url:'ritmpcheckplan/checkers/list'},
        getUser:{method:'GET',url:'user/{id}'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},
        getEnvconfig: {method: 'GET', url: 'envconfig/{type}'},
        getCheckRecords: {method: 'GET', url: 'ritmpcheckrecord/list'},
        getCheckTaskConfig: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=checkTaskSet\.isLateCheckAllowed'},

        saveTask: {method: 'POST', url: 'ritmpcheckplan/{id}/checktables'}, // 保存检查任务
        delTask: {method: 'DELETE', url: 'ritmpcheckplan/{id}/checktables'},  // 删除检查任务

        getDominationArea: {method: 'GET', url: 'dominationarea/list'},
        getEquipment: {method: 'GET', url: 'equipment/list'},
        getMajorRiskSource: {method: 'GET', url: 'majorrisksource/list'},
        getMajorChemicalProcess: {method: 'GET', url: 'majorchemicalprocess/list'},
        getMajorChemicalObj: {method: 'GET', url: 'majorchemicalobj/list'},
        getCheckTableByCheckObj: {method: 'GET', url: 'ritmpchecktable/list/{checkObjectId}'},

        getEquipmentType: {method: 'GET', url: 'equipmenttype/isDataReferencedList'},
        getChemicalType: {method: 'GET', url: 'checkobjectcatalog/baseChemicalObj/treeList'},
        getProcessType: {method: 'GET', url: 'checkobjectcatalog/majorChemicalProcess/treeList'},
        getDominationAreaList: {method: 'GET', url: 'dominationarea/list/1/1?criteria.orderValue.fieldName=modifyDate&criteria.orderValue.orderType=1&disable=0&orgId={orgId}'},

        checkItemType: {method: 'GET', url: 'risktype/list'},
        // 新增检查项
        createItem: {method: 'POST', url: 'ritmpchecktable/{id}/checkitems'},
        // 获取检查项
        getCheckTables: {method: 'GET', url: 'ritmpchecktable/{id}'},
        // 更新分组名称
        updateGroupName: {method: 'PUT', url: 'ritmptableitemrel/updategroupname'},
        // 修改检查项
        updateItem: {method: 'PUT', url: 'ritmpcheckitem'},
        // 删除检查项
        delTableItem: {method: 'DELETE', url: 'ritmpchecktable/{id}/checkitems'},
        // 移动检查项
        updateItemOrderNo:{method:'PUT',url: 'ritmptableitemrel/{type}/updateItemOrderNo'},
        // 移动分组
        sortGroup: {method: 'PUT', url: 'ritmpchecktable/checkitems/sortGroup'},
        //删除分组（包括分组下的所有检查项）
        delTableGroup: {method: 'DELETE', url: 'ritmptableitemrel/deleteByCheckTableId'},
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("ritmpcheckplan"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '6420005001',
        'edit': '6420005002',
        'delete': '6420005003',
        'publish': '6420005201',
        'invalid': '6420005202'
    };
    return resource;
});