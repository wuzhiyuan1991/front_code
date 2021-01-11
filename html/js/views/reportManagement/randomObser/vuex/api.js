define(function (require) {
    var LIB = require("lib");
    var customActions = {
        queryTaskExecuteAbs: {method: 'GET', url: '/rpt/radomObser/new/userParticipation'},

        queryDataNumLimit: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=reportFunction.dataNumLimit'}
    };
    var resource = LIB.Vue.resource(null, {}, customActions);
    return resource;
});