define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        addMsguser:{method:'POST',url:'msguser/insertBatch/{compId}'},
        deleteMsguser:{method:'DELETE',url:'msguser'},
        queryMsgjson:{method:'GET',url:'msgjson/list'},
        updateMsgjson:{method:'PUT',url:'msgjson'}
    };
    
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("msguser"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
    };
    return resource;
});