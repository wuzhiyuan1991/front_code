define(function(require){
    var LIB = require("lib");
	var customActions = {
		//整改情况-公司-日期范围-超期未整改-绝对值、平均值
		overduerectCompAbs : {method: 'GET', url: 'rpt/stats/checkreform/overduerect/comp/all'},
		//整改情况-公司-日期范围-超期未整改-趋势
		overduerectCompTrend: {method: 'GET', url: 'rpt/stats/checkreform/overduerect/comp/all/trend'},
		//整改情况-公司-日期范围-整改率-绝对值、平均值
		reformrateCompAbs: {method: 'GET', url: 'rpt/stats/checkreform/reformrate/comp/all'},
		//整改情况-公司-日期范围-整改率-趋势
		reformrateCompTrend : {method: 'GET', url: 'rpt/stats/checkreform/reformrate/comp/all/trend'},


		//整改情况-部门-日期范围-超期未整改-绝对值、平均值
		overduerectDepAbs : {method: 'GET', url: 'rpt/stats/checkreform/overduerect/dep/all'},
		//整改情况-部门-日期范围-超期未整改-趋势
		overduerectDepTrend: {method: 'GET', url: 'rpt/stats/checkreform/overduerect/dep/all/trend'},
		//整改情况-部门-日期范围-整改率-绝对值、平均值
		reformrateDepAbs: {method: 'GET', url: 'rpt/stats/checkreform/reformrate/dep/all'},
		//整改情况-部门-日期范围-整改率-趋势
		reformrateDepTrend : {method: 'GET', url: 'rpt/stats/checkreform/reformrate/dep/all/trend'},


		//整改情况-设备设施-日期范围-整改率-绝对值、平均值
		overduerectEquipAbs: {method: 'GET', url: 'rpt/stats/checkreform/overduerect/equip/all'},
		//整改情况-设备设施-日期范围-整改率-趋势
		overduerectEquipTrend: {method: 'GET', url: 'rpt/stats/checkreform/overduerect/equip/all/trend'},
		//整改情况-设备设施-日期范围-超期未整改-绝对值、平均值
		reformrateEquipAbs: {method: 'GET', url: 'rpt/stats/checkreform/reformrate/equip/all'},
		//整改情况-设备设施-日期范围-超期未整改-趋势
		reformrateEquipTrend: {method: 'GET', url: 'rpt/stats/checkreform/reformrate/equip/all/trend'}
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});