define(function(require){
    var LIB = require("lib");
	var customActions = {
		//区域设施-公司-日期范围-绝对值
		compAbs : {method: 'GET', url: 'rpt/stats/equip/comp/all'},
		//区域设施-公司-日期范围-平均值
		compAvg: {method: 'GET', url: 'rpt/stats/equip/comp/avg'},
		//区域设施-公司-日期范围-趋势
		compTrend: {method: 'GET', url: 'rpt/stats/equip/comp/all/trend'},


		//区域设施-部门-日期范围-绝对值
		depAbs : {method: 'GET', url: 'rpt/stats/equip/dep/all'},
		//区域设施-部门-日期范围-平均值
		depAvg: {method: 'GET', url: 'rpt/stats/equip/dep/avg'},
		//区域设施-部门-日期范围-趋势
		depTrend: {method: 'GET', url: 'rpt/stats/equip/dep/all/trend'},


		//区域设施-设备设施-日期范围-绝对值、平均值
		equipAbs: {method: 'GET', url: 'rpt/stats/equip/equip/all'},
		//区域设施-设备设施-日期范围-趋势
		equipTrend: {method: 'GET', url: 'rpt/stats/equip/equip/all/trend'}
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});