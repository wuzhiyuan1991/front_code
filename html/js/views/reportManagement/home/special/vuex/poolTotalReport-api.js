define(function(require){
    var LIB = require("lib");
	var customActions = {
		//隐患总数统计-公司分组
		poolCountByOrg : {method: 'GET', url: 'rpt/stats/pool/org/all'}
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});