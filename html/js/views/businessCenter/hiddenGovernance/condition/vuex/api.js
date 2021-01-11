define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        //list : {method: 'GET', url: 'activiticondition/list/{pageNo}/{pageSize}'},
        //get : {method: 'GET', url: 'activiticondition/{id}'},
        //create : {method: 'POST', url: 'activiticondition'},
        //update : {method: 'PUT', url: 'activiticondition'},
        //remove : _.extend({method: 'DELETE', url: 'activiticondition/ids'}, apiCfg.delCfg),
        //exportExcel : {method: 'GET', url: 'activiticondition/exportExcel'},
        //importExcel : {method: 'POST', url: 'activiticondition/importExcel'},
  
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("activiticondition"));
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});