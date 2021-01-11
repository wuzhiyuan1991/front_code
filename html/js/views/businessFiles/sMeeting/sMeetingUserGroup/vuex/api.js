define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'ltlpsup/disable'},

  	queryGroupUserRels : {method: 'GET', url: 'peoplegroup/groupuserrels/list/{pageNo}/{pageSize}'},
		saveGroupUserRel : {method: 'POST', url: 'peoplegroup/{id}/groupuserrel'},
		removeGroupUserRels : _.extend({method: 'DELETE', url: 'peoplegroup/{id}/groupuserrels'}, apiCfg.delCfg),
		updateGroupUserRel : {method: 'PUT', url: 'peoplegroup/{id}/groupuserrel'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("peoplegroup"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2810001001',
        'edit':   '2810001002',
        'delete': '2810001003',
        'import': '2810001004',
        'export': '2810001005',
       
    };
    return resource;
});