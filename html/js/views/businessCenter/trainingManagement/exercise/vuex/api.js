define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
    	cancelPublish : {method: 'PUT', url:'exam/cancel'},
    	publish : {method: 'PUT', url:'exam/pub'},
        queryExamSchedules : {method: 'GET', url: 'exam/examschedules/list/{pageNo}/{pageSize}'},
        saveExamSchedule : {method: 'POST', url: 'exam/{id}/examschedule'},
        removeExamSchedules : _.extend({method: 'DELETE', url: 'exam/{id}/examschedules'}, apiCfg.delCfg),
        updateExamSchedule : {method: 'PUT', url: 'exam/{id}/examschedule'},
        queryUsers : {method: 'GET', url: 'exam/users/list/{pageNo}/{pageSize}'},
        saveUsers : {method: 'POST', url: 'exam/{id}/users'},
        removeUsers : _.extend({method: 'DELETE', url: 'exam/{id}/users'}, apiCfg.delCfg),
        getExamRaterConfig: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=training.examRater'}
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("exam"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '4010007001',
        'edit': '4010007002',
        'delete': '4010007003',
        'publish': '4010007201',
        'cancelPublish': '4010007016'
    };
    return resource;
});