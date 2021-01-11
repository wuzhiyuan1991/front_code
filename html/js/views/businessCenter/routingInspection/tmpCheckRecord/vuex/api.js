define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");
	var customActions = {
        // get : {method: 'GET', url: 'ritmpchecktaskgroup/{id}'},
        // create : {method: 'POST', url: 'ritmpcheckrecord', time: 0},
        // update : {method: 'PUT', url: 'ritmpcheckrecord', time: 0},
        // getCheckTable: {method: 'GET', url: 'ritmpchecktable/{id}'},
        // getUUID: {method: 'GET', url: 'helper/getUUID'},
        // createCheckRecDet : {method : 'POST', url:'ritmpcheckrecorddetail'},
        // getEnvConfig:{method:'GET',url:'systembusinessset/getBusinessSetByNamePath/{checkTableId}'},
        // getCheckTaskConfig: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=checkTaskSet.isLateCheckAllowed'},
        // getCheckTask: {method: 'GET', url: 'ritmpchecktask/{id}'},
        //
        // getCheckObjects: {method: 'GET', url: 'ritmpchecktask/{id}/checktable/checkobject'},
        // getCheckTaskGroup: {method: 'GET', url: 'ritmpchecktaskgroup/{id}'},
        // getCheckGroupTask: {method: 'GET', url: 'ritmpchecktaskgroup/{id}/checktask', time: 0},
        getDoneCheckTable: {method: 'GET', url: 'ritmpcheckrecord/{checkTaskId}/checktask', time: 0}, // 点击任务组明细 查看 接口
        // getCheckRecord: {method: 'GET', url: 'ritmpcheckrecord/list'}
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("ritmpcheckrecord"));
	var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '6420007001',
        'export': '6420007005',
        'exportPdf': '6420007006',
        'delete':'6420007003'
    };
    return resource;
});