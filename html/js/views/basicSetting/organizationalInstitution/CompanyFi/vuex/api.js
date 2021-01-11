define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");
    var customActions = {

        list: {method: 'GET', url: 'organization/list/{pageNo}/{pageSize}'},
        get: {method: 'GET', url: 'organization/{id}'},
        create: {method: 'POST', url: 'organization/company'},
        update: {method: 'PUT', url: 'organization/company'},
        del: {method: 'DELETE', url: 'organization/company'},
        listDept: {method: 'GET', url: 'organization/list'},
        rel: {method: 'GET', url: 'organization/rel'},
        listRegion:{method:'GET', url:'organization/region/list'},
        getRegion:{method:'GET', url:'organization/region/{id}'},
        listOrganization:{method: 'GET', url: 'organization/list'},
        countOrganization:{method: 'GET', url: 'organization/count'},

        remove : _.extend({method: 'DELETE', url: 'organization/company'}, apiCfg.delCfg),
        exportExcel : {method: 'GET', url: 'organization/exportExcel'},
        importExcel : {method: 'POST', url: 'organization/importExcel'},

        getIndustry: {method: 'GET', url: 'group/industry'},
        queryIndustryList: {method: 'GET', url: 'industrycategory/list'},

        //list : {method: 'GET', url: 'organization/list/{pageNo}/{pageSize}'},
        //get : {method: 'GET', url: 'organization/{id}'},
        //create : {method: 'POST', url: 'organization'},
        //update : {method: 'PUT', url: 'organization'},
        //remove : _.extend({method: 'DELETE', url: 'organization/ids'}, apiCfg.delCfg),
        //exportExcel : {method: 'GET', url: 'organization/exportExcel'},
        //importExcel : {method: 'POST', url: 'organization/importExcel'},
        create4copy : {method: 'POST', url: 'organization/{id}/copy'},
        updateDisable: {method: 'PUT', url: 'organization/disable'},

        countChildrenOrg:{method: 'GET', url: 'organization/children/count'},

        downGmjfOrg:{method: 'GET', url: 'gmjf/down/all'},
    };

    var resource = Vue.resource(null, {}, customActions);
    resource.__auth__ = {
        'create': '1020001001',
        'import': '1020001004',
        'export': '1020001005',
        'edit': '1020001002',
        'delete': '1020001003',
        'copy':'1020001010',
        'enable':'1020001009',
        'allview':'1020001011',
        'downGmjfOrg':'1020001020'
    };
    return resource;
});