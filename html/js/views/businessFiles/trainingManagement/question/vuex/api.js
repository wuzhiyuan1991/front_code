define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		queryOpts : {method: 'GET', url: 'question/opts/list'},
		saveOpt : {method: 'POST', url: 'question/{id}/opt'},
		removeOpts : _.extend({method: 'DELETE', url: 'question/{id}/opts'}, apiCfg.delCfg),
		updateOpt : {method: 'PUT', url: 'question/{id}/opt'},
		//queryExamPoints : {method: 'GET', url: 'question/exampoints/list/{pageNo}/{pageSize}'},
        queryExamPoints : {method: 'GET', url: 'question/exampoints/list'},
        queryExampoint : {method: 'GET', url: 'exampoint/list'},
		saveExamPoints : {method: 'POST', url: 'question/{id}/exampoints'},
		removeExamPoints : _.extend({method: 'DELETE', url: 'question/{id}/exampoints'}, apiCfg.delCfg),
		queryCourses : {method: 'GET', url: 'question/courses/list/{pageNo}/{pageSize}'},
		saveCourses : {method: 'POST', url: 'question/{id}/courses'},
		removeCourses : _.extend({method: 'DELETE', url: 'question/{id}/courses'}, apiCfg.delCfg),
        deleteBatch : {method: 'DELETE', url: 'question/ids'},
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("question"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        create: '4020003001',
        'import': '4020003004',
        'export': '4020003005',
        edit: '4020003002',
        'delete': '4020003003'
    };
    return resource;
});