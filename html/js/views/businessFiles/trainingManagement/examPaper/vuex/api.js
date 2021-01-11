define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
    	updateProperty : {method: 'PUT', url: 'exampaper/property'},
    	queryPaperTopic : {method: 'GET', url: 'exampaper/{id}/papertopics/{papertopicId}'},
		queryPaperTopics : {method: 'GET', url: 'exampaper/papertopics/list'},
		savePaperTopic : {method: 'POST', url: 'exampaper/{id}/papertopic'},
		movePaperTopics : {method: 'PUT', url: 'exampaper/{id}/papertopics/order'},
		removePaperTopics : _.extend({method: 'DELETE', url: 'exampaper/{id}/papertopics'}, apiCfg.delCfg),
		updatePaperTopic : {method: 'PUT', url: 'exampaper/{id}/papertopic'},
		queryExamPoints : {method: 'GET', url: 'exampaper/exampoints/list'},
		saveExamPoints : {method: 'POST', url: 'exampaper/{id}/exampoints'},
		removeExamPoints : _.extend({method: 'DELETE', url: 'exampaper/{id}/exampoints'}, apiCfg.delCfg),
//		updateTopicSort:{method:'PUT', url:'exampaper/{id}/papertopic/move'},
		moveQuestions : {method: 'PUT', url: 'exampaper/{id}/papertopic/{papertopicId}/questions/order'},
		
		getQuetionStatistic:{method:'GET', url:'question/statistic'},
		getQuetionList:{method:'GET', url:'question/list'},
		queryQuestions : {method: 'GET', url: 'exampaper/{id}/papertopic/{papertopicId}/questions/list/{pageNo}/{pageSize}'},
		saveQuestions : {method: 'POST', url: 'exampaper/{id}/papertopic/{papertopicId}/questions'},
		removeQuestions : _.extend({method: 'DELETE', url: 'exampaper/{id}/papertopic/{papertopicId}/questions'}, apiCfg.delCfg),

		getQuetionType : {method: 'GET', url:'exampaper/exampoints/list'},
		//查询章节
		queryCourseKpoints : {method:'GET',url:'course/coursekpoints/list'},
		// 查询知识点
        queryExampoint : {method: 'GET', url: 'exampoint/list'},
		// 根据课程查询知识点
		queryExamPointByCourseId: {method: 'GET', url: 'course/exampoints/list/1/999'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("exampaper"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        create: '4020002001',
        edit: '4020002002',
        'delete': '4020002003',
		'import':'4020002004'
    };
    return resource;
});