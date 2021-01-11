define(function (require) {
    var LIB = require("lib");
    var customActions = {
        queryRiCheckTypes: {method: 'GET', url: 'richecktype/list'},
        queryRiCheckTypesByTable: {method: 'GET', url: 'richecktable/richecktypes/list'},
        queryRiCheckTables: {method: 'GET', url: 'richecktable/list'},
        //不合格情况统计
        queryUnqualifiedCases: {method: 'GET', url: 'rpt/iri/checkdetail/unqualified/all'},
        //整改率统计
        queryReformRateAbs: {method: 'GET', url: 'rpt/iri/checkreform/reformrate/all'},
        queryReformRateTrend: {method: 'GET', url: 'rpt/iri/checkreform/reformrate/trend'},
        //超期未整改统计
        queryOverdueUnrectifiedAbs: {method: 'GET', url: 'rpt/iri/checkreform/overdueunrectified/all'},
        queryOverdueUnrectifiedTrend: {method: 'GET', url: 'rpt/iri/checkreform/overdueunrectified/trend'},

        queryFindProblemAbs: {method: 'GET', url: 'rpt/iri/checkdetail/find/problem/all'},
        queryTaskExecuteAbs: {method: 'GET', url: 'rpt/iri/checkdetail/task/execute/all'},

        // 一票两卡
        queryOpCardSpeciality: {method: 'GET', url: 'rpt/jse/opcard/speciality/all'},
        queryOpCardAll: {method: 'GET', url: 'rpt/jse/opcard/org/all'},
        queryDataNumLimit: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=reportFunction.dataNumLimit'}
    };
    var resource = LIB.Vue.resource(null, {}, customActions);
    return resource;
});