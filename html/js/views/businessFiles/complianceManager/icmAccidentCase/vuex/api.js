define(function (require) {

  var Vue = require("vue");
  var apiCfg = require("apiCfg");

  var customActions = {
    updateDisable: {
      method: 'PUT',
      url: 'icmaccidentcase/disable'
    },
    deleteByIdOrIds: {
      method: 'DELETE',
      url: '/icmaccidentcase/ids'
    }
  };

  customActions = _.defaults(customActions, apiCfg.buildDefaultApi("icmaccidentcase"));
  var resource = Vue.resource(null, {}, customActions);
  resource.__auth__ = {
    'create': '2040006001',
    'edit': '2040006002',
    'delete': '2040006003',
    'import': '2040006004',
    'export': '2040006005',
    'enable': '2040006006',
  };
  return resource;
});