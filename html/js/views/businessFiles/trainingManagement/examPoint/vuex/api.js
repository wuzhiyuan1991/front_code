define(function (require) {

	var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        list:{method: 'GET', url: 'exampoint/list?criteria.orderValue.fieldName=create_date&criteria.orderValue.orderType=0'},
        move:{method: 'PUT', url: 'exampoint/move/{type}'},
        queryQuestions : {method: 'GET', url: 'exampoint/questions/list/{pageNo}/{pageSize}'},
		saveQuestions : {method: 'POST', url: 'exampoint/{id}/questions'},
		removeQuestions : _.extend({method: 'DELETE', url: 'exampoint/{id}/questions'}, apiCfg.delCfg),
		queryCourses : {method: 'GET', url: 'exampoint/courses/list/{pageNo}/{pageSize}'},
		saveCourses : {method: 'POST', url: 'exampoint/{id}/courses'},
		removeCourses : _.extend({method: 'DELETE', url: 'exampoint/{id}/courses'}, apiCfg.delCfg),
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("exampoint"));
    var resource = Vue.resource(null, {}, customActions);


    resource.__auth__ = {
        'create': '4020004001',
        'edit': '4020004002',
        'delete': '4020004003',
        'import': '4020004004',
        'export': '4020004005'
    };


    return resource;
});