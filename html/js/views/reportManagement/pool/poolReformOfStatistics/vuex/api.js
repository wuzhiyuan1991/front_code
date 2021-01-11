define(function (require) {
  var LIB = require("lib");
  var customActions = {
    //专业隐患统计
    poolCountByReform: {
      method: 'GET',
      url: 'rpt/stats/pool/reform/info'
    },
    // queryLookUpItem : {method: 'GET', url:'lookup/fh1dmaom93/lookupitem/fh1dmjh3rt'}
  };
  var resource = LIB.Vue.resource(null, {}, customActions);
  return resource;
});