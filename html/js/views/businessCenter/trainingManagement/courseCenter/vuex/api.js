define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
    	createTrainTask : {method: 'POST', url: 'traintask'},
		queryCourseKpoints : {method:'GET',url:'course/coursekpoints/list'},
		queryTeachers : {method: 'GET', url: 'course/teachers/list/{pageNo}/{pageSize}'},
		queryIndustryCategories : {method: 'GET', url: 'course/industrycategories/list'},
		queryCourseKpointExamPapers : {method: 'GET', url: 'course/{id}/coursekpoint/{coursekpointId}/exampapers/list'},

		//查询课程关联的试卷：入参课程id、试卷类型（criteria.intValue.examPaperType：2为模拟卷，3为考试卷，不传则查所有关联试卷）
		queryExamPapers : {method: 'GET', url: 'course/exampapers/list'},
		listFile: {method: 'GET', url: 'file/list'},

		//课程类型
        queryCategorySubjects:{method: 'GET', url: 'subject/category/list?criteria.orderValue.fieldName=create_date&criteria.orderValue.orderType=0'},
        
        //取证类型
        queryCertificationSubjects:{method: 'GET', url: 'subject/certification/list?criteria.orderValue.fieldName=create_date&criteria.orderValue.orderType=0'},

		getUUID: {method: 'GET', url: 'helper/getUUID'},

		//行业
        industrycategoryList: {method: 'GET', url: 'industrycategory/list'},



	};

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("course"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '4020001001',
        'import': '4020001004',
        'export': '4020001005',
        'edit': '4020001002',
        'delete': '4020001003',
		'publish': '4020001006',
		'disable': '4020001007'
    };
    return resource;
});