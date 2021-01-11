define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'svrandomchecktable/disable'},

		querySvRandomCheckRecords : {method: 'GET', url: 'svrandomchecktable/svrandomcheckrecords/list/{pageNo}/{pageSize}'},
		saveSvRandomCheckRecord : {method: 'POST', url: 'svrandomchecktable/{id}/svrandomcheckrecord'},
		removeSvRandomCheckRecords : _.extend({method: 'DELETE', url: 'svrandomchecktable/{id}/svrandomcheckrecords'}, apiCfg.delCfg),
		updateSvRandomCheckRecord : {method: 'PUT', url: 'svrandomchecktable/{id}/svrandomcheckrecord'},
        getViolation: {method: 'GET', url: 'violationrecord/list'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("svrandomchecktable"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2010030001',
        'edit':   '2010030002',
        'delete': '2010030003',
        'import': '2010030004',
        'export': '2010030005',
        'enable': '2010030006',
        'exportDetail':'2010030007'
    };
    return resource;
});