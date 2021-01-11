define(function(require){
    var LIB = require("lib");
	var customActions = {
		//隐患总数统计-公司分组
        checkRecorCountByEvaluate : {method: 'GET', url: 'rpt/stats/tpa/checkrecord/car/evaluate'},
        checkRecordCountByEvaluateDate : {method: 'GET', url: 'rpt/stats/tpa/checkrecord/car/evaluate/date'}
	};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});