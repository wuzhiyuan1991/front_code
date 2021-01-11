define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
    	publish : {method: 'PUT', url: 'course/publish'},//上架
    	disable : {method: 'PUT', url: 'course/disable'},//下架
        queryCourseKpoint : {method: 'GET', url: 'course/{id}/coursekpoint/{coursekpointId}'},
        checkCourseKpoint : {method: 'GET', url: 'course/{id}/coursekpoint/{coursekpointId}/checkstatus'},
		queryCourseKpoints : {method:'GET',url:'course/coursekpoints/list'},
		saveCourseKpoint : {method: 'POST', url: 'course/{id}/coursekpoint'},
		//getCourse : {method: 'GET', url: 'course/{id}'},
		removeCourseKpoints : _.extend({method: 'DELETE', url: 'course/{id}/coursekpoints'}, apiCfg.delCfg),
		updateCourseKpoint : {method: 'PUT', url: 'course/{id}/coursekpoint'},
		queryTeachers : {method: 'GET', url: 'course/teachers/list/{pageNo}/{pageSize}'},
		saveTeachers : {method: 'POST', url: 'course/{id}/teachers'},
		removeTeachers : _.extend({method: 'DELETE', url: 'course/{id}/teachers'}, apiCfg.delCfg),
		queryIndustryCategories : {method: 'GET', url: 'course/industrycategories/list'},
		saveIndustryCategories : {method: 'POST', url: 'course/{id}/industrycategories'},
		removeIndustryCategories : _.extend({method: 'DELETE', url: 'course/{id}/industrycategories'}, apiCfg.delCfg),
		queryCourseKpointExamPapers : {method: 'GET', url: 'course/{id}/coursekpoint/{coursekpointId}/exampapers/list'},
		saveCourseKpointExamPapers : {method: 'POST', url: 'course/{id}/coursekpoint/{coursekpointId}/exampapers'},
		removeCourseKpointExamPapers : _.extend({method: 'DELETE', url: 'course/{id}/coursekpoint/{coursekpointId}/exampapers'}, apiCfg.delCfg),

		queryCommentStatistic : {method: 'GET', url: 'course/coursecomment/statistic'},
		queryCourseComments : {method: 'GET', url: 'course/coursecomment/list/{pageNo}/{pageSize}'},
		saveCourseComment : {method: 'POST', url: 'course/{id}/coursecomment'},
		removeCourseComments : _.extend({method: 'DELETE', url: 'course/{id}/coursecomments'}, apiCfg.delCfg),
		updateCourseComment : {method: 'PUT', url: 'course/{id}/coursecomment'},
		
		queryExamPoints : {method: 'GET', url: 'course/exampoints/list/{pageNo}/{pageSize}'},
		saveExamPoints : {method: 'POST', url: 'course/{id}/exampoints'},
		removeExamPoints : _.extend({method: 'DELETE', url: 'course/{id}/exampoints'}, apiCfg.delCfg),
		
		//查询课程关联的试卷：入参课程id、试卷类型（criteria.intValue.examPaperType：2为模拟卷，3为考试卷，不传则查所有关联试卷）
		queryExamPapers : {method: 'GET', url: 'course/exampapers/list'},
		listFile: {method: 'GET', url: 'file/list'},

		//课程类型
        queryCategorySubjects:{method: 'GET', url: 'subject/category/list?criteria.orderValue.fieldName=create_date&criteria.orderValue.orderType=0&_bizModule=courseEdition'},
        
        //取证类型
        queryCertificationSubjects:{method: 'GET', url: 'subject/certification/list?criteria.orderValue.fieldName=create_date&criteria.orderValue.orderType=0'},

		getUUID: {method: 'GET', url: 'helper/getUUID'},

		//删除文件
		deleteFile:{method:'DELETE',url:'course/files'},
		//行业
        industrycategoryList: {method: 'GET', url: 'industrycategory/list'},
		// 知识点
        exampointList: {method: "GET", url: "/exampoint/list/1/100000"},

        // 检查视频是否通过审核
        checkVideo: {method: 'GET', url: 'course/{id}/coursekpoint/{coursekpointId}/check'},
		copy:{method:'GET',url:'course/copy/{courseId}/{destCompId}/{destOrgId}'}
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