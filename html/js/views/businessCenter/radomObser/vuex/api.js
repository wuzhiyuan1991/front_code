define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        convert: {method: 'PUT', url: 'radomobser/convert'},
        submit: {method: 'PUT', url: 'radomobser/submit'},
        audit: {method: 'PUT', url: 'radomobser/audit'},
        vedo: {method: 'PUT', url: 'radomobser/vedo'},
        getViolation: {method: 'GET', url: 'violationrecord/list'},
        //删除
        delete: {method: 'DELETE', url: 'radomobser/ids'},
        getDominationAreaList: {method: 'GET', url: 'dominationarea/list/1/1?criteria.orderValue.fieldName=modifyDate&criteria.orderValue.orderType=1&disable=0&orgId={orgId}'},
        getTableBatchHandleSetting: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=tableBatchHandle.dataNumLimit'},
        getRandomObserveConfig:{method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=radomObserSet.region'},
        checkPoolAuditor: {method: 'GET', url: 'radomobser/checkPoolAuditor/{id}'},
        getUndoCount: {method: 'GET', url: 'radomobser/todo/num'},
        getBusinessSetting: {method: 'GET', url: 'systembusinessset/root?name=radomObserSet&compId=9999999999'}
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("radomobser"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2020002001',
        'edit': '2020002002',
        'delete': '2020002003',
        'audit': '2020002202',
        'submit': '2020002204',
        "totalDelete":"2020002006",
        'exportTodo':'2020002005',
        'exportTotal':'2020002007',
        'exportDealt':'2020002008',
    };
    return resource;
});