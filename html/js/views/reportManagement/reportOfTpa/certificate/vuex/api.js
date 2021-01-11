define(function(require){
    var LIB = require("lib");
    var customActions = {
        percentOfPassByComp : {method: 'GET', url: 'rpt/stats/tpa/certificate/valid'},
    };
    var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});