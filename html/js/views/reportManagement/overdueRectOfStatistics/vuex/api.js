define(function(require){
    var LIB = require("lib");
	var customActions = {
		//整改情况-公司-日期范围-超期未整改-绝对值
		overdueRectCompAbs : {method: 'GET', url: '/rpt/stats/pool/overduerect/comp/all'},
		//整改情况-公司-日期范围-超期未整改-趋势
		overdueRectCompTrend: {method: 'GET', url: '/rpt/stats/pool/overduerect/comp/all/trend'},
		//整改情况-部门-日期范围-超期未整改-绝对值
		overdueRectDepAbs : {method: 'GET', url: '/rpt/stats/pool/overduerect/dep/all'},


		//整改情况-部门-日期范围-超期未整改-趋势
		overdueRectDepTrend: {method: 'GET', url: '/rpt/stats/pool/overduerect/dep/all/trend'},
		//整改情况-设备设施-日期范围-超期未整改-绝对值
		overdueRectEquipAbs: {method: 'GET', url: '/rpt/stats/pool/overduerect/equip/all'},
		//整改情况-设备设施-日期范围-超期未整改-趋势
		overdueRectEquipTrend: {method: 'GET', url: '/rpt/stats/pool/overduerect/equip/all/trend'},
		//整改情况-公司-日期范围-超期未整改-绝对值
		overdueRectCompAbsExport : {method: 'GET', url: '/rpt/stats/pool/overduerect/comp/all/export'},
		//整改情况-部门-日期范围-超期未整改-绝对值
		overdueRectDepAbsExport : {method: 'GET', url: '/rpt/stats/pool/overduerect/dep/all/export'},

	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});