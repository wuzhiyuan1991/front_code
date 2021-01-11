define(function(require){
    var LIB = require("lib");
	var customActions = {
		cardTaskCountByBizType : {method: 'GET', url: '/rpt/jse/opcard/opcardTask/bizType'},
		cardTaskCountByBizTypeForStatus : {method: 'GET', url: '/rpt/jse/opcard/opcardTask/bizType/status'},
		cardTaskCountByBizTypeForException : {method: 'GET', url: '/rpt/jse/opcard/opcardTask/bizType/exception'},
		cardTaskCountByBizTypeForPublishTime : {method: 'GET', url: '/rpt/jse/opcard/opcardTask/bizType/publishTime'},
		cardTaskCountByBizTypeForUserException : {method: 'GET', url: '/rpt/jse/opcard/opcardTask/bizType/user/exception'},
		OpCardTaskList : {method: 'GET', url: '/rpt/jse/opcard/opcardTask/list'},
};
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});