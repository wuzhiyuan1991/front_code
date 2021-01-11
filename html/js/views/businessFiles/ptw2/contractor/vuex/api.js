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
        verifyTelephone:{method: 'GET', url: 'contractoremp/verifyTelephone'}
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
    };
    return resource;
});