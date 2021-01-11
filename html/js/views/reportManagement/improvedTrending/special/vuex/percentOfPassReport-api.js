define(function(require){
    var LIB = require("lib");
	var customActions = {
		//检查表的符合率趋势（定制报表）- 公司-折线
		percentOfPassByComp : {method: 'GET', url: 'rpt/checkTable/comp/percentOfPass'},
        //检查表的符合率趋势（定制报表）- 部门-折线
		percentOfPassByOrg : {method: 'GET', url: 'rpt/checkTable/org/percentOfPass'},
		//检查表的符合率（定制报表）- 公司-柱状
		percentOfPassGroupByComp : {method: 'GET', url: 'rpt/checkTable/comp/percentOfPass?_bizModule=bar'},
        //检查表的符合率（定制报表）- 部门-柱状
		percentOfPassGroupByOrg : {method: 'GET', url: 'rpt/checkTable/org/percentOfPass?_bizModule=bar'},
		
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});