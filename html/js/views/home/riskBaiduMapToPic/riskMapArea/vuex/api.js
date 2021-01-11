define(function(require){

    var Vue = require("vue");
    var customActions = {
        staticDept: {method: 'GET', url: 'riskstatic/area/static'}, // 静态部门
        // staticEquip: {method: 'GET', url: 'riskstatic/deptEquipmentRiskStatic'}, // 静态设备设施
        // dynamicDept: {method: 'GET', url: 'riskdynamic/deptRiskDynamic'}, // 动态部门
        // dynamicEquip: {method: 'GET', url: 'riskdynamic/deptEquipmentRiskDynamic'}, // 动态设备设施
        // getDynamicCheckTables: {method: 'GET', url: 'riskdynamic/checktables'},
        // getEquipmentCheckTables: {method: 'GET', url: 'riskdynamic/equipments'},
        // getEquipmentDetail: {method: 'GET', url: 'riskdynamic/equipment/risklevel'},
        // getStaticCheckTables: {method: 'GET', url: 'riskstatic/checktables'},
        // getCheckTableInfo: {method: 'GET', url: 'checktable/{id}?_bizModule=RiskMap'},
        // getChartData: {method: 'GET', url: 'riskdynamic/checktable/risklevel'},
        // getStaticEquipmentDetail: {method: 'GET', url: 'checktable/checkitems'},
        // getStaticEquipmentCts: {method:'GET', url: 'riskstatic/equipments'},
        getPoints: {method: 'GET', url: 'riskdynamic/dept/map'},
        // getDynamicAreaList: {method: 'GET', url: 'riskdynamic/dominationarea/list'},
        // getDynaCheckTables: {method: 'GET', url: 'riskdynamic/domination/checktables'},
        // getDynaRiskLevel: {method: 'GET', url: 'riskdynamic/domination'},
        getStaticAreaList: {method: 'GET', url: 'riskdynamic/dominationarea/list'},
        getStaticCheckTables: {method: 'GET', url: 'riskstatic/domination/checktables'},
        getStaticRiskLevel: {method: 'GET', url: 'riskstatic/domination'},
        getCheckItems: {method: 'GET', url: 'riskassessment/checktable'},
        getChartData: {method: 'GET', url: 'riskdynamic/checktable/record/risklevel'},
        getUser: {method: 'GET', url: 'riskdynamic/dominationarea/person'}, // 获取属地负责人
        getRiskModelByCompId: {method: 'GET', url: 'riskmodel/comp/gradelats'},

        getSetting: {method: 'GET', url: 'lookup/{code}/lookupitem/{lookupitemCode}?_bizModule=code'},
        getStaticSetting:{method: 'GET', url: 'riskstatic/draworg/static'},
        updateSetting: {method: 'PUT', url: 'lookupitem'},

        listAreaNames: {method:'GET', url: 'dominationarea/list/name'},
        getMapImage: {method: 'GET', url: 'lookup/rescfg/value?path=risk_map_setting.mock_risk_data_level2_001'},
        getDynamicData: {method: 'GET', url: 'taskcallback/latest?name=RiskDynamic'},
        refreshDynamicData: {method: 'GET', url: 'riskdynamic/area/dynamic'},

        getDetailInfo:{method:'GET', url:'riskdynamic/draworg/dynamic'},
        getDomination:{method:'GET',url:'dominationarea/{id}'},

        getDominationLookUp: {method: 'GET', url: 'riskdynamic/xbgd'},


        // 西部管道相关
        riskdynamicxbgd: {method: 'GET', url: 'riskdynamic/xbgd/riskjudgment'}, // 动态
        riskstaticxbgd:{method: 'GET', url: 'riskstatic/xbgd/equipment'},   // 静态
        getNewStaticRisk:{method: 'GET', url:'riskstatic/xbgd'}

    };
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {

    };
    return resource;
});