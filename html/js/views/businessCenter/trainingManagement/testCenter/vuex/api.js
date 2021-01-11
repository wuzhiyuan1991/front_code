define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
    		getQuetionList:{method:'GET', url:'question/list'},
            getQuetionType : {method: 'GET', url:'exampaper/exampoints/list'},
            getQuetionStatistic:{method:'GET', url:'question/statistic'},
            queryExampoint : {method: 'GET', url: 'exampoint/list'},
            queryTrainTaskStatus : {method: 'GET', url: 'examschedule/traintask/{id}'},
            getExerciseConfig: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=training.isExamQstOpenForExercise'},

    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("examschedule"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '4010002015'
    };
    return resource;
});