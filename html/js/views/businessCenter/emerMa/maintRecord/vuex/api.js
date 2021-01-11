define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'emermaintrecord/disable'},

		queryUsers : {method: 'GET', url: 'emermaintrecord/users/list/{pageNo}/{pageSize}'},
		saveUsers : {method: 'POST', url: 'emermaintrecord/{id}/users'},
		removeUsers : _.extend({method: 'DELETE', url: 'emermaintrecord/{id}/users'}, apiCfg.delCfg),

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("emermaintrecord"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
         'create': '9020005001',
         'edit':   '9020005002',
         'delete': '9020005003',
         'import': '9020005004',
         'export': '9020005005',
         'copy': '9020005007',
    };
    return resource;
});