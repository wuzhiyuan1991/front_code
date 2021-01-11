define(function (require) {
    var LIB = require("lib");
    var customActions = {
        // 一票两卡
        queryTableQuantityOrg: {method: 'GET', url: 'rpt/iri/checktable/quantity/org'},
        queryDataNumLimit: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=reportFunction.dataNumLimit'},
        queryTableQuantityOrgAll:{method: 'GET', url:'/rpt/iri/checktable/quantity/details/all'}
    };
    var resource = LIB.Vue.resource(null, {}, customActions);
    return resource;
});