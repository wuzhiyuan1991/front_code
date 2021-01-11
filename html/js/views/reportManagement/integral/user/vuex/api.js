define(function(require){
    var LIB = require("lib");
	var customActions = {
        //个人积分统计
		selectRptUserScoreData : {method: 'GET', url: 'integralscorerecord/selectRptScoreData?type=1'},
        queryDataNumLimit: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=reportFunction.dataNumLimit'}
    };
	var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});