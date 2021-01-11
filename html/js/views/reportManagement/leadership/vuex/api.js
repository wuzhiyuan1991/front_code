define(function(require){
    var LIB = require("lib");
    var customActions = {
        getAvgScore: {method: 'GET', url: 'rpt/stats/asmttask/avgscore'},
        getSubScore: {method: 'GET', url: 'rpt/stats/asmttask/list/1/20'},
        getDetail: {method: 'GET', url: 'rpt/stats/asmttask/detail'},
        getSameLevel: {method: 'GET', url: 'rpt/stats/asmttask/samegrade'},
        getPlansByTableId: {method: 'GET', url: 'asmtplan/list'}
    };
    var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});