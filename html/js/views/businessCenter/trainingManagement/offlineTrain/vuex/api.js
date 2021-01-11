define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getUUID: {method: 'GET', url: 'helper/getUUID'},
        cancelPass : _.extend({method: 'PUT', url: 'trainplan/{id}/traintask/cancelpass'}, apiCfg.delCfg),
		updateTrainTasks : {method: 'PUT', url: 'trainplan/{id}/traintasks'},
        //删除文件
        _deleteFile: {method: 'DELETE', url: 'file'},
        publish:{method:'PUT', url:'trainplan/publish'},
        cancelPublish : {method: 'PUT', url:'trainplan/cancel'},

        queryUserLatestTrainTasks :{method: 'GET', url: 'trainplan/traintasks/latestlist/{pageNo}/{pageSize}'},

        queryTrainTasks : {method: 'GET', url: 'trainplan/traintasks/list/{pageNo}/{pageSize}'},
        saveTrainTasks : {method: 'POST', url: 'trainplan/{id}/traintasks'},
        removeTrainTasks : _.extend({method: 'DELETE', url: 'trainplan/{id}/traintasks'}, apiCfg.delCfg),

        queryExamsByCourseId: {method: 'GET', url: 'exampaper/simplelist/1/10'},

        saveCert: {method: 'POST', url: 'cert'},
        updateCert: {method: 'PUT', url: 'cert'},
        queryCertById: {method: 'GET', url: 'cert/{id}'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("trainplan"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '4010005001',
        'edit':   '4010005002',
        'delete': '4010005003',
        //'import': '4010005004',
        //'export': '4010005005',
        'notice': '4010005008',//提醒规则
        'setResult': '4010005030',//上报结果
        'setResultBatch': '4010005031',//批量上报结果
        'uploadFile':'4010005034',//上传附件
        'deleteFile':'4010005035',//删除附件
        'publish':'4010005201',//发布
        'cancelPublish':'4010005016',//取消发布
        'retrain': '4010005020',//下达复培计划
    };
    return resource;
});