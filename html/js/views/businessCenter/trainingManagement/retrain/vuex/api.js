define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        cancel : {method: 'DELETE', url: 'traintask/cancel'},
        getCourse : {method: 'GET', url: 'course/{id}'},
        queryTeachers : {method: 'GET', url: 'course/teachers/list'},
        queryStudyDetails : {method: 'GET', url: 'traintask/studydetails/list'},
        //查询课程关联的试卷：入参课程id、试卷类型（criteria.intValue.examPaperType：2为模拟卷，3为考试卷，不传则查所有关联试卷）
        queryExamPapers : {method: 'GET', url: 'course/exampapers/list'},

        queryIndustryCategories : {method: 'GET', url: 'course/industrycategories/list'},
        queryExamsByCourseId: {method: 'GET', url: 'exampaper/simplelist/1/10'},


        addAdmin: {method: 'POST', url: 'bizuserrel/batch'},
        getAdmins: {method: 'GET', url: 'bizuserrel/list/1/999?type=1'},
        deleteAdmin: {method: 'DELETE', url: 'bizuserrel'},


        createRemindset: {method: 'POST', url: 'remindset'},
        deleteRemind: {method: 'DELETE', url: 'remindset'},
        createRetrainPlan: {method: 'POST', url: 'trainplan'},

        updateLookupItem : {method: 'PUT', url: 'lookup/{id}/lookupitem'},
        querySendNotice: {method: 'GET', url: 'lookup/lookupitems/list?code=notice_switch_cfg'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("traintask"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'retrain': '4010008001',//下达复培计划
        'export' : '4010008005',//导出
        'notice' : '4010008002',//提醒规则
        'search' : '4010008008'//复培搜索
    };
    return resource;
});