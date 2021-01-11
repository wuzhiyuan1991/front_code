define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
       
        //显示关键词
        updateDisable : {method: 'PUT', url: 'techkeyword/disable'},
        deleteTechkeyword:{method: 'DELETE', url: 'techkeyword/ids'},
    
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("techkeyword"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '3410003001',
        // 'import': '2010004004',
        'edit': '3410003002',
        'delete': '3410003003',
        // 'export':'2010004005'
    };
    return resource;
});