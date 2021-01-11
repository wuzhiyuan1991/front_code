define(function(require){
    var LIB = require("lib");
	var customActions = {
		//隐患总数统计-公司分组
		poolCountByOrg : {method: 'GET', url: 'rpt/stats/pool/org/all'},
        poolCountByDep : {method: 'GET', url: 'rpt/stats/pool/dep/all'},
        //隐患总数统计-日期分组
        poolCountByOrgAndDate : {method: 'GET', url: 'rpt/stats/pool/comp/bar/all'},
        poolCountByDepAndDate : {method: 'GET', url: 'rpt/stats/pool/dep/bar/all'},
        queryDataNumLimit: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=reportFunction.dataNumLimit'}
    };
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});