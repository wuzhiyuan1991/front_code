define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {

        //list: {method: 'GET', url: 'mailconfig/list/{pageNo}/{pageSize}'},
        //get: {method: 'GET', url: 'mailconfig/{id}'},
        //create: {method: 'POST', url: 'mailconfig'},
        //update: {method: 'PUT', url: 'mailconfig'},
        updateDefault: {method: 'PUT', url: 'mailconfig/default'},
        updateDisable: {method: 'PUT', url: 'mailconfig/disable'},
        updateStartup: {method: 'PUT', url: 'mailconfig/startup'},
        updateCompany: {method: 'PUT', url: 'mailconfig/company'},
        clearOrg: {method: 'DELETE', url: "mailconfig/org"},
        test: {method: 'POST', url: 'mailconfig/test'},
        del: {method: "DELETE", url: "mailconfig"},
        listOrg: {method: "GET", url: "organization/list"},


        //remove : _.extend({method: 'DELETE', url: 'mailconfig/ids'}, apiCfg.delCfg),
        //exportExcel : {method: 'GET', url: 'mailconfig/exportExcel'},
        //importExcel : {method: 'POST', url: 'mailconfig/importExcel'},

    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("mailconfig"));
    var resource = Vue.resource(null, {}, customActions);
    resource.__auth__ = {
        'create': '2010002001',
        'import': '1010004004',
        'edit': '2010002002',
        'delete': '2010002003',
        'enable': '2010002021',
        'setDefault': '',
        'relate': ''
    };
    return resource;
});