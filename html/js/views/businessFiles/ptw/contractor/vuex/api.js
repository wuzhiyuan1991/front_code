define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'contractor/disable'},
        getFileList:{method:'GET',url:"file/list"}, //文件
		queryContractorEmps : {method: 'GET', url: 'contractor/contractoremps/list/{pageNo}/{pageSize}'},
		saveContractorEmp : {method: 'POST', url: 'contractor/{id}/contractoremp'},
		removeContractorEmps : _.extend({method: 'DELETE', url: 'contractor/{id}/contractoremps'}, apiCfg.delCfg),
		updateContractorEmp : {method: 'PUT', url: 'contractor/{id}/contractoremp'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},

        updateInforel: {method:"PUT", url:'contractoremp/contractorempinforel'},
        saveInforel: {method:"POST", url:'contractoremp/contractorempinforel'},
        removeInforel: {method:"DELETE", url:'contractoremp/contractorempinforel'},
        contractorempDisable:{method:"PUT", url:'/contractoremp/disable'},
        verifyTelephoneOrLoginName:{method: 'GET', url: 'contractoremp/verify'},
        createLookup:{method: 'POST', url: 'lookup/{id}/lookupitem'},
        createLookupCode:{method: 'GET', url: 'lookup/getByCode/{code}'},
        updataLookup:{method:'GET',url:'lookup/lookupitems/list/1/10000'},
        queryIndustryList:{method:'GET',url:'lookup/lookupitems/list/1/10000?id=fj2dzzttzh'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("contractor"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '7010001001',
        // 'edit':   '7010001002',
        // 'delete': '7010001003',
        // 'import': '7010001004',
        // 'export': '7010001005',
        // 'enable': '7010001006',

        'createEmp': '7010003001',
        'editEmp':   '7010003002',
        'deleteEmp': '7010003003',
        'importEmp': '7010003004',
        'exportEmp': '7010003005',
        'enableEmp': '7010003020',
        'unLockEmp': '7010003611',
        'reSetPwd': '7010003610'
    };
    return resource;
});