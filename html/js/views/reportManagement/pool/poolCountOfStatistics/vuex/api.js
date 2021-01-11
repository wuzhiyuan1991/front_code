define(function(require){
    var LIB = require("lib");
    var customActions = {
        poolCountByOrg : {method: 'GET', url: 'rpt/stats/pool/org/all'},
        poolCountByDate : {method: 'GET', url: 'rpt/stats/pool/type/all'},

        // queryLookUpItem : {method: 'GET', url:'lookup/fh3tpuvly3/lookupitem/fh3tq6fcrp'}
    };
    var resource = LIB.Vue.resource(null,{}, customActions);
    return resource;
});
