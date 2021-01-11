define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");
    var customActions = {
        saveDangerConfs:{method:'POST', url:'/integralscoreconf/saveConfs?_bizModule=danger'},
        saveTrainConfs:{method:'POST', url:'/integralscoreconf/saveConfs?_bizModule=train'},
        queryConfsByNest:{method:'GET', url:'/integralscoreconf/queryConfsByNest'},
        queryRiskGradeLatRange:{method:'GET', url:'/integralscoreconf/queryRiskGradeLatRange'},
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("integralscoreconf"));
    var resource = Vue.resource(null, {}, customActions);
    return resource;
});