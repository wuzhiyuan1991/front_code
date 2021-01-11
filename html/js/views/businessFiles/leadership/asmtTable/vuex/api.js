define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		queryAsmtItems : {method: 'GET', url: 'asmttable/asmtitems/list/{pageNo}/{pageSize}'},
		saveAsmtItem : {method: 'POST', url: 'asmttable/{id}/asmtitem'},
		removeAsmtItems : {method: 'DELETE', url: 'asmttable/{id}/asmtitems'},
		updateAsmtItem : {method: 'PUT', url: 'asmttable/{id}/asmtitem'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},
        updateItemOrderNo: {method:'PUT',url: 'asmtitem/{type}/updateItemOrderNo'},
        updateGroupName: {method: 'PUT', url: 'asmtitem/group'},
        deleteGroup: {method: 'DELETE', url:'asmtitem/group'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("asmttable"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '8020001001',
        'edit': '8020001002',
        'delete': '8020001003'
    };
    return resource;
});