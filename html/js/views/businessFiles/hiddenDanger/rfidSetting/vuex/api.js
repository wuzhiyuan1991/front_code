define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        queryTableGroupRfidRels : {method: 'GET', url: 'rfid/tablegrouprfidrels/list/{pageNo}/{pageSize}'},
        saveTableGroupRfidRels : {method: 'POST', url: 'rfid/{id}/tablegrouprfidrels'},
        removeTableGroupRfidRels : _.extend({method: 'DELETE', url: 'rfid/{id}/tablegrouprfidrels'}, apiCfg.delCfg),
        updateTableGroupRfidRel : {method: 'PUT', url: 'rfid/{id}/tablegrouprfidrel'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("rfid"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '_YYYYYYY001',
        'edit':   '2010013002',
        // 'delete': '_YYYYYYY003',
        // 'import': '_YYYYYYY004',
        // 'export': '_YYYYYYY005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});