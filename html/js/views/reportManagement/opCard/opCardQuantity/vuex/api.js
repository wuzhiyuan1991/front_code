define(function (require) {
    var LIB = require("lib");
    var customActions = {
        // 一票两卡
        queryOpCardQuantitySpeciality: {method: 'GET', url: 'rpt/jse/opcard/quantity/speciality'},
        queryOpCardQuantityOrg: {method: 'GET', url: 'rpt/jse/opcard/quantity/org'},
        queryDataNumLimit: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=reportFunction.dataNumLimit'},
        queryOpCardQuantityAll:{method: 'GET', url:'rpt/jse/opcard/quantity/speciality/all'}
    };
    var resource = LIB.Vue.resource(null, {}, customActions);
    return resource;
});