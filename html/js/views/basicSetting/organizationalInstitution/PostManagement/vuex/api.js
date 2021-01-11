define(function (require) {

  var Vue = require("vue");
  var apiCfg = require("apiCfg");
  var customActions = {

    //list: {method: 'GET', url: 'position/list/{pageNo}/{pageSize}'},
    //get: {method: 'GET', url: 'position/{id}'},
    rel: {
      method: 'GET',
      url: 'position/rel'
    },
    //create: {method: 'POST', url: 'position'},
    //update: {method: 'PUT', url: 'position'},
    del: {
      method: 'DELETE',
      url: 'position'
    },
    listDept: {
      method: 'GET',
      url: 'organization/list'
    },
    listUser: {
      method: 'GET',
      url: 'user/list'
    },
    listUserByName: {
      method: 'GET',
      url: 'user/like'
    },
    distribution: {
      method: 'PUT',
      url: 'position/distribution'
    },
    createUsers: {
      method: "POST",
      url: 'position/users'
    },
    delUsers: {
      method: "DELETE",
      url: 'position/users'
    },
    //初始化组织机构
    listOrganization: {
      method: 'GET',
      url: 'organization/list'
    },


    //remove : _.extend({method: 'DELETE', url: 'position'}, apiCfg.delCfg),
    //exportExcel : {method: 'GET', url: 'position/exportExcel'},
    //importExcel : {method: 'POST', url: 'position/importExcel'},
    queryUsers: {
      method: 'GET',
      url: 'position/users/list/{pageNo}/{pageSize}'
    },
    saveUsers: {
      method: 'POST',
      url: 'position/{id}/users'
    },
    removeUsers: _.extend({
      method: 'DELETE',
      url: 'position/{id}/users'
    }, apiCfg.delCfg),

    querySpeciality: {
      method: 'GET',
      url: 'position/speciality/list/{pageNo}/{pageSize}'
    },
    saveSpeciality: {
      method: 'POST',
      url: 'position/{id}/speciality'
    },
    removeSpeciality: _.extend({
      method: 'DELETE',
      url: 'position/{id}/speciality'
    }, apiCfg.delCfg),

    updateDisable: {
      method: 'PUT',
      url: 'position/disable'
    },
  };
  customActions = _.defaults(customActions, apiCfg.buildDefaultApi("position"));
  var resource = Vue.resource(null, {}, customActions);
  resource.__auth__ = {
    'create': '1020004001',
    'import': '1020004004',
    'export': '1020004005',
    'edit': '1020004002',
    'delete': '1020004003',
    'copy': '1020004010',
    'enable': '1020004009'
  };

  return resource;
});