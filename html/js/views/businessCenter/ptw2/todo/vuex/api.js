define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'ptwworkcard/disable'},

        saveAuthorize: {method: 'PUT', url: 'ptwworkcard/{id}/authorize'},//作业批准人签字接口， 入参为PtwWorkPersonnel对象：{signResult:1/2,signOpinion:xxx}
        queryWorkpeoplenel : {method: 'GET', url: 'ptwworkpermit/workpeoplenel/list/{pageNo}/{pageSize}'},
        saveWorkPersonnel : {method: 'POST', url: 'ptwworkpermit/{id}/workpersonnel'},
        removeWorkpeoplenel : _.extend({method: 'DELETE', url: 'ptwworkpermit/{id}/workpeoplenel'}, apiCfg.delCfg),
        updateWorkPersonnel : {method: 'PUT', url: 'ptwworkpermit/{id}/workpersonnel'},

        queryWorkhistoriesList:{method:'GET', url:'/ptwworkcard/workhistories/list/{currentPage}/{pageSize}'},
        updateResult:{method:'PUT', url:'ptwworkcard/audit'},

        getWorkPermit : {method: 'GET', url: 'ptwworkpermit/{id}'},//作业票详情
        saveWorkPermit: {method: 'PUT', url: 'ptwworkpermit/save'},//填报作业票-保存，入参为PtwWorkPermit对象，全部属性详见ptw/js/ptwWorkPermit/page/detail.js
        submitWorkPermit: {method: 'PUT', url: 'ptwworkpermit/submit'},//填报作业票-提交，入参为PtwWorkPermit对象:{id:workPermitId}

        checkAuthoriser : {method: 'GET', url: 'ptwworkcard/{id}/checkAuthoriser'},//校验是否有批准签字权限
        queryJobParam:{method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath'},
        queryWorkPermits: {method: 'GET', url: 'ptwworkcard/workpermits/list'},//查询作业票版本，入参为{id:workCardId}

        getWorkCardDetail:{method:"GET", url:'ptwworkcard/{id}'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("ptwworkcard"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        "create": "7080002001",//发起作业
        'delete': '7080002003',//删除
        'deal': '7080002007',//处理
        'relate': '7080002008',//关联作业
        'preview': '7080002009',//预览
    };
    return resource;
});