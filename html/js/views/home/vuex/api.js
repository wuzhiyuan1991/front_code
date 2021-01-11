define(function(require){

    var Vue = require("vue");

	var apiCfg = require("apiCfg");

    var customActions = {
    	listMyTraining:{method:'GET',url:'traintask/mine/list/1/5'},
    	listTodo:{method:'GET',url:'todo/mine/1/5?criteria.orderValue.fieldName=modifyDate&criteria.orderValue.orderType=1'},
    	listCheckItem:{method:'GET',url:'checkitem/list'},
    	listMaterial:{method:'GET', url:'material/list/1/5?type=2'},
    	queryGroupStatistic:{method:'GET', url:'organization/group/statistic'},
        getSetting: {method: 'GET', url: 'lookup/{code}/lookupitem/{lookupitemCode}?_bizModule=code'},
	};

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi(""));
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});