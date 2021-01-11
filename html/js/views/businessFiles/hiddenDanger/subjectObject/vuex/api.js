define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        //list : {method: 'GET', url: 'checkobject/list/{pageNo}/{pageSize}'},
        //get : {method: 'GET', url: 'checkobject/{id}'},
        //create : {method: 'POST', url: 'checkobject'},
        //update : {method: 'PUT', url: 'checkobject'},
        //remove : _.extend({method: 'DELETE', url: 'checkobject'}, apiCfg.delCfg),
        //exportExcel : {method: 'GET', url: 'checkobject/exportExcel'},
        //importExcel : {method: 'POST', url: 'checkobject/importExcel'},
		queryCheckTables : {method: 'GET', url: 'checkobject/checktables/list/{pageNo}/{pageSize}'},
		saveCheckTables : {method: 'POST', url: 'checkobject/{id}/checktables'},
		removeCheckTables : _.extend({method: 'DELETE', url: 'checkobject/{id}/checktables'}, apiCfg.delCfg),
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("checkobject"));
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});