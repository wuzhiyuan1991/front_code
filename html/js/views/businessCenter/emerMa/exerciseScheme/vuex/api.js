define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'exercisescheme/disable'},
		publish: {method: 'PUT', url: 'exercisescheme/publish'},
        finish: {method: 'PUT', url: 'exercisescheme/finish'},
        getExercisePlan: {method: 'GET', url: 'exerciseplan/{id}'},
        updateInfo:{method: 'PUT', url: 'exercisescheme'},
        updateSelfevaluationmode:{method: 'PUT', url: 'exercisescheme/selfevaluationmode'},


		queryRiskAnalyses : {method: 'GET', url: 'exercisescheme/riskanalyses/list/{pageNo}/{pageSize}'},
		saveRiskAnalysis : {method: 'POST', url: 'exercisescheme/{id}/riskanalysis'},
		removeRiskAnalyses : _.extend({method: 'DELETE', url: 'exercisescheme/{id}/riskanalyses'}, apiCfg.delCfg),
		updateRiskAnalysis : {method: 'PUT', url: 'exercisescheme/{id}/riskanalysis'},

		querySelfEvaluationQuestions : {method: 'GET', url: 'exercisescheme/selfevaluationquestions/list/{pageNo}/{pageSize}'},
		saveSelfEvaluationQuestion : {method: 'POST', url: 'exercisescheme/{id}/selfevaluationquestion'},
		removeSelfEvaluationQuestions : _.extend({method: 'DELETE', url: 'exercisescheme/{id}/selfevaluationquestions'}, apiCfg.delCfg),
		updateSelfEvaluationQuestion : {method: 'PUT', url: 'exercisescheme/{id}/selfevaluationquestion'},

		querySelfEvaluationTasks : {method: 'GET', url: 'exercisescheme/selfevaluationtasks/list/{pageNo}/{pageSize}'},
		saveSelfEvaluationTask : {method: 'POST', url: 'exercisescheme/{id}/selfevaluationtask'},
		removeSelfEvaluationTasks : _.extend({method: 'DELETE', url: 'exercisescheme/{id}/selfevaluationtasks'}, apiCfg.delCfg),
		updateSelfEvaluationTask : {method: 'PUT', url: 'exercisescheme/{id}/selfevaluationtask'},

		queryExerciseParticipants : {method: 'GET', url: 'exercisescheme/exerciseparticipants/list/{pageNo}/{pageSize}'},
		saveExerciseParticipant : {method: 'POST', url: 'exercisescheme/{id}/exerciseparticipant'},
        saveExerciseParticipants : {method: 'POST', url: 'exercisescheme/{id}/exerciseparticipants'},

        removeExerciseParticipants : _.extend({method: 'DELETE', url: 'exercisescheme/{id}/exerciseparticipants'}, apiCfg.delCfg),
		updateExerciseParticipant : {method: 'PUT', url: 'exercisescheme/{id}/exerciseparticipant'},

        queryExerciseResources : {method: 'GET', url: 'exercisescheme/exerciseresources/list/{pageNo}/{pageSize}'},
        saveExerciseResource : {method: 'POST', url: 'exercisescheme/{id}/exerciseresource'},
        removeExerciseResources : _.extend({method: 'DELETE', url: 'exercisescheme/{id}/exerciseresources'}, apiCfg.delCfg),
        updateExerciseResource : {method: 'PUT', url: 'exercisescheme/{id}/exerciseresource'},


        queryExerciseestimate : {method: 'GET', url: 'exerciseestimate'},
        saveExerciseestimate : {method: 'POST', url: 'exerciseestimate'},
        removeExerciseestimate : _.extend({method: 'DELETE', url: 'exerciseestimate'}, apiCfg.delCfg),
        updateExerciseestimate : {method: 'PUT', url: 'exerciseestimate'},

        queryExercisesummary : {method: 'GET', url: 'exercisesummary'},
        saveExercisesummary : {method: 'POST', url: 'exercisesummary'},
        removeExercisesummary : _.extend({method: 'DELETE', url: 'exercisesummary'}, apiCfg.delCfg),
        updateExercisesummary : {method: 'PUT', url: 'exercisesummary'},

        getFileList:{method:'GET',url:"file/list"}, //文件
        getSelfTaskId:{method:"GET", url: "/exercisescheme/{id}/selfevaluationtask/{selfEvaluatorId}?_bizModule=bySelfEvaluator"},
   // selfevaluationquestion/order
        saveEmerQuestionOrderNo:{method:"PUT", url:"selfevaluationquestion/order"},

        submitTask: {method: 'POST', url:"selfevaluationtask/submit"},
        saveTask: {method: 'POST', url:"selfevaluationtask/save"},
        getTask: {method: 'GET', url:"selfevaluationtask/{id}"},

        queryAnalysesList:{method: 'GET', url:"exercisescheme/riskanalyses/list/1/100"},

        implement:{method: 'PUT', url:"exercisescheme/implement"},
        queryEmerGroups: {method: 'GET', url: 'emergroup/list/1/9999?type=1&criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0'},
        queryEmerGroups2: {method: 'GET', url: 'emergroup/list/1/9999?type=2&criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0'},
        // getSelfTask:{method:"GET", url: "/exercisescheme/{id}/selfevaluationtask/{selfEvaluatorId}?_bizModule=bySelfEvaluator"}
        queryUsers : {method: 'GET', url: 'exerciseplan/users/list/1/9999'},

        updateOrganizationPersonList:{method: 'PUT', url:"exercisescheme/{id}/exerciseparticipant/quote"},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("exercisescheme"));
    var resource = Vue.resource(null,{}, customActions);

    resource.__auth__ = {
        'create': '9010002001',
        'edit':   '9010002002',
        'delete': '9010002003',
        //'import': '9010002004',
        //'export': '9010002005',
        //'enable': '9010002006',
        'publish': '9010002007',
        'copy': '9010002008',
        'selfEvaluation': "9010002009",//填报自评
        'exerciseestimate': "9010002010",//填报评估
        'summary':'9010002011'//填报总结
    };
    return resource;

});