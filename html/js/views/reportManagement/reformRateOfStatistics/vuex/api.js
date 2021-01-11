define(function(require){
    var LIB = require("lib");
	var customActions = {
		//整改情况-公司-日期范围-整改率-绝对值
		reformRateCompAbs: {method: 'GET', url: 'rpt/stats/checkreform/reformrate/comp/all'},
		//整改情况-公司-日期范围-整改率-趋势
		reformRateCompTrend : {method: 'GET', url: 'rpt/stats/checkreform/reformrate/comp/all/trend'},
		//整改情况-部门-日期范围-整改率-绝对值
		reformRateDepAbs: {method: 'GET', url: 'rpt/stats/checkreform/reformrate/dep/all'},
		//整改情况-部门-日期范围-整改率-趋势
		reformRateDepTrend : {method: 'GET', url: 'rpt/stats/checkreform/reformrate/dep/all/trend'},
		//整改情况-设备设施-日期范围-整改率-绝对值
		reformRateEquipAbs: {method: 'GET', url: 'rpt/stats/checkreform/reformrate/equip/all'},
		//整改情况-设备设施-日期范围-整改率-趋势
		reformRateEquipTrend: {method: 'GET', url: 'rpt/stats/checkreform/reformrate/equip/all/trend'},
		queryLookUpItem : {method: 'GET', url:'lookup/fh3tslzc85/lookupitem/fh3ttfxyh3'}
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});