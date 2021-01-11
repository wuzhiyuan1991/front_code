define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {

        //list: {method: 'GET', url: 'pool/list/{pageNo}/{pageSize}'},
        //get: {method: 'GET', url: 'pool/{id}'},
        //create: {method: 'POST', url: 'pool'},
        //update: {method: 'PUT', url: 'pool'},
        //提交
        'submit': {method: 'POST', url: 'pool/submit'},
        //审核
        'approval': {method: 'POST', url: 'pool/decide'},
        //获取审核结果列表
        'approvalStatus':{method: 'GET', url: 'pool/approvalStatus/{id}'},
        //获取配置的整改人和验证人列表
        'reformUsers':{method: 'GET', url: 'pool/reformUsers/{id}'},
        //获取erp工单整改默认处理人
        'erpDefaultCandidates':{method: 'GET', url: 'pool/erpDefaultCandidates/{id}'},
        //获取整改阶段与验证阶段配置的处理期限
        'deadlineDate':{method: 'GET', url: 'pool/deadlineDate/{id}'},
        //撤销
        'undo': {method: 'POST', url: 'pool/undo'},
        'processReform':{method:'POST', url:'pool/processReform'},
        //分配人员
        'reform': {method: 'POST', url: 'pool/reform'},
        //整改受阻
        'reformFail': {method: 'POST', url: 'pool/reformFaile'},
        //整改完成
        'reformSuccess': {method: 'POST', url: 'pool/reformSuccess'},
        //验证
        'verify': {method: 'POST', url: 'pool/verify'},
        //委托
        'delegate':{method:'POST', url:'pool/delegate'},
        //获取当前任务候选人
        'getTaskCandidate':{method:'GET', url:'pool/candidate/{id}', time: 0},
        //得到整改信息
        'getReforms': {method: 'GET', url: 'reform/{id}'},
        //删除
        'delete': {method: 'DELETE', url: 'pool'},
        //流程图片
        'history': {method: 'GET', url: 'pool/history/{id}'},
        getHistoryItem: {method: 'GET', url: '/pool/reform/{id}'},
        //风险分类
        getRiskType: {method: 'GET', url: 'risktype/list'},
        //危害因素
        getHazardFactor: {method: 'GET', url: 'hazardfactor/list'},
        //初始化组织机构
        listOrganization: {method: 'GET', url: 'organization/list'},
        //创建风险评估
        createRisk: {method: 'POST', url: 'riskassessment'},
        //检查项列表
        getCheckItem: {method: 'GET', url: 'checkitem/list'},
        //检查项树
        checkItemVOList: {method: 'GET', url: 'checkitem/itemtypes'},
        //人员树
        listTree: {method: 'GET', url: 'user/tree'},
        // // 导出
        // exportExcel: {method: 'GET', url: '/pool/synExportExcel/{compress}'},
        // 任务数
        getNumber: {method: 'GET', url: '/userexporttask/count/{status}'},

        //获取业务对象关联的文件信息
        //listFile: {method: 'GET', url: 'file/list'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},
        //删除文件
        _deleteFile: {method: 'DELETE', url: 'file'},
        //初始化岗位
        listPosition:{method: 'GET', url: 'position/list'},
        //修改回转后数据状态
        updateRotationRisk:{method: 'PUT', url: 'pool'},
        updateReform:{method: 'PUT', url: 'reform/updateSchedule'},
        getShowSpecialtyConfig: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=poolGovern.isShowSpecialty'},
        getPoolGovernConfig: {method: 'GET', url: 'systembusinessset/root?compId=9999999999&name=poolGovern'},
        getDominationAreaList: {method: 'GET', url: 'dominationarea/list/1/1?criteria.orderValue.fieldName=modifyDate&criteria.orderValue.orderType=1&disable=0&orgId={orgId}'},
        // getOPCardConfig: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=poolGovern.nestedOpCard'},
        getViolation: {method: 'GET', url: 'violationrecord/list'},
        queryPoolNum: {method: 'GET', url: 'pool/user/num'},

        queryErpSet: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=poolGovern.erpWorkOrder'},
        queryIsErpAssign: {method: 'GET', url: 'pool/{id}/isErpAssign'},
        getTableBatchHandleSetting: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=tableBatchHandle.dataNumLimit'},
        getRiskTypeSetting: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=poolGovern.isRiskTypeRequiredWhenAudit'},
        deleteByIds: {method: 'DELETE', url: 'pool/ids'},

        getCheckRecordBySourceId: {method: 'GET', url: 'checkrecord/{detailId}?_bizModule=detailId'},
        getRadomObser: {method: 'GET', url: 'radomobser/{id}'},
        getRiCheckRecordBySourceId: {method: 'GET', url: 'richeckrecord/{detailId}?_bizModule=detailId'},
        getRiTmpCheckRecordBySourceId: {method: 'GET', url: 'ritmpcheckrecord/{detailId}?_bizModule=detailId'},
        createReport: {method: 'GET', url: 'pool/createReport/{ids}'},
        getRegisterInfo:{method: 'GET', url: '/pool/register/{poolId}'},
        getOrganization:{method: 'GET', url: '/organization/{id}'},
        queryIsRiskIdenti:{method: 'GET', url: '/pool/{id}/isRiskIdenti'},
        saveIsRiskIdentiMeasures:{method: 'POST', url: '/pool/riskidenti/measuresrel'},

        getRiskLevelMapList:{method: "GET", url: 'lookup/lookupitems/list?code=risk_level_map'},
        syncMajorDanger:{method: 'PUT', url: '/pool/majorDanger/sync'},
        deleteMajorDanger:{method: 'DELETE', url: '/pool/majorDanger'},
        listFile: {method: 'GET', url: 'file/list'},
        updateInfo:{method:"PUT",url:'pool/info'}
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("pool"));
    var resource = Vue.resource(null, {}, customActions);
    resource.__auth__ = {
        'registCreate': '5010001001',
        'registImport': '5010001004',
        'registExport': '5010001005',
        'registEdit': '5010001002',
        'registDelete': '5010001003',
        'registApproval': '5010001023',
        'assignImport': '5010002004',
        'assignExport': '5010002005',
        'assignDelete': '5010001003',
        'assignReform': '5010002009',
        'assignDelegate':'5010002020',
        'reformExport': '5010003005',
        'reformDelete': '5010001003',
        'reformFail': '5010003011',
        'reformDone': '5010003010',
        'reformDelegate':'5010003020',
        'verifyExport': '5010004005',
        'verifyDelete': '5010001003',
        'verifyDone': '5010004012',
        'verifyDelegate':'5010004020',
        'totalExport': '5010006005',
        'totalDelete': '5010001003',
        'totalBack': '5010006014',
        'templateSet': '5010006015',
        'editVerifyUser': '5010002021',
        'createReport': '5010006016',
        'totalImport':'5010006016',
        'search':'5010006017',
        'riskIdenti':'5010001024',
        'syncMajorDanger':'5010006002',
        'majorDangerDelete':'5010006003',
        'majorDangerTotalBack':'5010006013',
        'majorDangerExport':'5010006006',
        'totalCreate': '5010006018',
        'totalEdit': '5010006019',
        'editInfo':'5010006020',
        'myRecordExport':'5010011005'
    };
    return resource;
});