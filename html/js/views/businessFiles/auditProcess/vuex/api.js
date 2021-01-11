define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        updateDisable : {method: 'PUT', url: 'auditprocess/disable'},

        queryAuditRoles : {method: 'GET', url: 'auditprocess/auditroles/list/{pageNo}/{pageSize}'},
        saveAuditRole : {method: 'POST', url: 'auditprocess/{id}/auditrole'},
        removeAuditRoles : _.extend({method: 'DELETE', url: 'auditprocess/{id}/auditroles'}, apiCfg.delCfg),
        updateAuditRole : {method: 'PUT', url: 'auditprocess/{id}/auditrole'},

        updateLookupItem : {method: 'PUT', url: 'lookup/{id}/lookupitem'},
        queryLookupItem: {method: 'GET', url: 'lookup/lookupitems/list?code=audit_process_switch'},
        checkAuditingExist: {method: 'GET', url: 'auditrecord/checkauditing/{type}'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("auditprocess"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '_YYYYYYY001',
        // 'edit':   '_YYYYYYY002',
        // 'delete': '_YYYYYYY003',
        // 'import': '_YYYYYYY004',
        // 'export': '_YYYYYYY005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});