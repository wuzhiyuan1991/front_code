define(function(require){
    var LIB = require("lib");
	var customActions = {
		//整改情况-机构-日期范围-平均值-整改时间
		queryAvgReformTimeByComp: {methods: 'GET', url: 'rpt/stats/checkreform/reformtime/comp/avg'},
		//整改情况-单位-日期范围-平均值-整改时间
		queryAvgReformTimeByDep: {methods: 'GET', url: 'rpt/stats/checkreform/reformtime/dep/avg'},
		
		//整改情况-机构-日期范围-平均值-趋势-整改时间
		queryAvgReformTimeByCompWithTrend: {methods: 'GET', url: 'rpt/stats/checkreform/reformtime/comp/avg/trend'},
		//整改情况-单位-日期范围-平均值-趋势-整改时间
		queryAvgReformTimeByDepWithTrend: {methods: 'GET', url: 'rpt/stats/checkreform/reformtime/dep/avg/trend'},
		queryLookUpItem : {method: 'GET', url:'lookup/fh3tty1vm2/lookupitem/fh3tujmxdr'}
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});