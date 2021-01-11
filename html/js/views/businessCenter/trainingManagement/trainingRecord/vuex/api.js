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
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("traintask"));
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});