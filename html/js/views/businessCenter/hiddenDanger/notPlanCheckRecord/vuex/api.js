define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");
    var customActions = {
        get: {method: 'GET', url: 'checkrecord/{id}', time: 0},
        create : {method: 'POST', url: 'checkrecord', time: 0},
        update : {method: 'PUT', url: 'checkrecord', time: 0},
        getCheckTable: {method: 'GET', url: 'checktable/{id}'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},
        createCheckRecDet : {method : 'POST', url:'checkrecorddetail'},
        getEnvConfig:{method:'GET',url:'systembusinessset/getBusinessSetByNamePath/{checkTableId}'},
        getCheckTaskConfig: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=checkTaskSet.isLateCheckAllowed'},
        getCheckTask: {method: 'GET', url: 'checktask/{id}'},

        getCheckObjects: {method: 'GET', url: 'checktask/{id}/checktable/checkobject'},
        getCheckTaskGroup: {method: 'GET', url: 'checktaskgroup/{id}'},
        getCheckGroupTask: {method: 'GET', url: 'checktaskgroup/{id}/checktask'},
        getShowVetoItemSetting: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=checkSubmit.isShowVetoItem'},
        getDoneCheckTable: {method: 'GET', url: 'checkrecord/{checkTaskId}/checktask'} // 点击任务组明细 查看 接口
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("checkrecord"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2020005001',
        'export': '2020005005',
        'delete': '2020005003',
        'exportPdf': '2020005006',
        'viewPool':"2020005007"
    };
    return resource;
});