define(function(require){
    var LIB = require("lib");
    var customActions = {
        //检查表的符合率趋势（定制报表）- 公司
        percentOfPassByComp : {method: 'GET', url: 'rpt/stats/tpa/certificate/valid'},
    };
    var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});