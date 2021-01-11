define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getDominationArea: {method: 'GET', url: 'dominationarea/list'},
        queryAuditRoles: {method: 'GET', url: 'pecauditrole/list'},//入参：岗位：type，公司Id：compId
        //添加审批人员
        //入参：岗位：type，审批人员数组:[]
        saveAuditRoles: {method: 'POST', url: 'pecposition/{type}/pecauditroles'},
        //编辑审批人员
        //入参：type:岗位，[{'user.id':null,relId:null,relType:null,compId:null}]:审批人员对象数组, mode:编辑模式 1按人员,2:按部门、专业
        updateAuditRoles: {method: 'PUT', url: 'pecposition/{type}/pecauditroles/{mode}'},
        removePecAuditRoles : _.extend({method: 'DELETE', url: 'pecposition/{type}/pecauditroles'}, apiCfg.delCfg),//入参：岗位:type，审批人员对象：{relId:null,relType:null,'user.id':null}
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("pecauditrole"));
    var resource = Vue.resource(null, {}, customActions);
    resource.__auth__ = {
        'edit': '2510002002',
    };
    return resource;
});