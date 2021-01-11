define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {

        //list: {method: 'GET', url: 'pool/list/{pageNo}/{pageSize}'},
        //get: {method: 'GET', url: 'pool/{id}'},
        //create: {method: 'POST', url: 'pool'},
        //update: {method: 'PUT', url: 'pool'},
        //提交
        'submit': {method: 'POST', url: 'tpapool/submit'},
        //审核
        'approval': {method: 'POST', url: 'tpapool/decide'},
        //获取审核结果列表
        'approvalStatus': {method: 'GET', url: 'tpapool/approvalStatus/{id}'},
        //获取配置的整改人和验证人列表
        'reformUsers': {method: 'GET', url: 'tpapool/reformUsers/{id}'},
        //撤销
        'undo': {method: 'POST', url: 'tpapool/undo'},
        'processReform': {method: 'POST', url: 'tpapool/processReform'},
        //分配人员
        'reform': {method: 'POST', url: 'tpapool/reform'},
        //整改受阻
        'reformFail': {method: 'POST', url: 'tpapool/reformFaile'},
        //整改完成
        'reformSuccess': {method: 'POST', url: 'tpapool/reformSuccess'},
        //验证
        'verify': {method: 'POST', url: 'tpapool/verify'},
        //得到整改信息
        'getReforms': {method: 'GET', url: 'tpareform/{id}'},
        //删除
        'delete': {method: 'DELETE', url: 'tpapool'},
        //流程图片
        'history': {method: 'GET', url: 'tpapool/history/{id}'},
        //风险分类
        getRiskType: {method: 'GET', url: 'tparisktype/list'},
        //危害因素
        getHazardFactor: {method: 'GET', url: 'hazardfactor/list'},
        //初始化组织机构
        listOrganization: {method: 'GET', url: 'organization/list'},
        //创建风险评估
        createRisk: {method: 'POST', url: 'riskassessment'},
        //人员树
        listTree: {method: 'GET', url: 'user/tree'},
        //获取业务对象关联的文件信息
        getUUID: {method: 'GET', url: 'helper/getUUID'},
        //删除文件
        _deleteFile: {method: 'DELETE', url: 'file'},
        //初始化岗位
        listPosition: {method: 'GET', url: 'position/list'},
        //修改回转后数据状态
        updateRotationRisk: {method: 'PUT', url: 'tpapool'},
        updateReform: {method: 'PUT', url: 'tpareform/updateSchedule'},
        updateEvaluate: {method: 'PUT', url: 'tpapool/{type}/evaluate'},
        getPoptipContent: {method: 'GET', url: 'evaluaterecord/list'}
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("tpapool"));
    var resource = Vue.resource(null, {}, customActions);
    return resource;
});