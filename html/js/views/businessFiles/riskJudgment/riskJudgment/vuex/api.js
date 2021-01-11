define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'riskjudgment/disable'},

		queryRiskJudgmentLevels : {method: 'GET', url: 'riskjudgment/riskjudgmentlevels/list/{pageNo}/{pageSize}'},
		saveRiskJudgmentLevel : {method: 'POST', url: 'riskjudgment/{id}/riskjudgmentlevel'},
		removeRiskJudgmentLevels : _.extend({method: 'DELETE', url: 'riskjudgment/{id}/riskjudgmentlevels'}, apiCfg.delCfg),
		updateRiskJudgmentLevel : {method: 'PUT', url: 'riskjudgment/{id}/riskjudgmentlevel'},
		moveRiskJudgmentLevels : {method: 'PUT', url: 'riskjudgment/{id}/riskjudgmentlevels/order'},
        queryRiskjudgmentlevels : {method: 'GET', url: 'riskjudgmentlevel/list'},
        queryRiskDetail:{method:"GET", url:'riskjudgmentunit/list'},
        queryRiskjudgmentGroup:{method:'',url:'riskjudgmentlevel/list/group'},
        addRiskjudgmentGroupName:{method:'POST', url:'riskjudgmentgroup'},
        upDateRiskjudgmentGroup:{method:'PUT', url: 'riskjudgmentgroup/item'},
        riskjudgmentunit:{method:'POST', url:'riskjudgmentunit'},
        riskjudgmentunitDelete:{method:"DELETE", url:"riskjudgmentunit"},
        riskjudgmentunitUpdate:{method:"PUT", url:'riskjudgmentunit'},
        upDateriskjudgmentPromise:{method:'PUT', url:'riskjudgmenttemplete/promise'}, //
        getFileList:{method:'GET',url:"file/list"},
        riskjudgmentlevel:{method:"PUT", url:"riskjudgmentlevel"},
        upDateRiskjudgmentGroupName:{method:'PUT', url:'riskjudgmentgroup'},
        deleteRiskjudgmentGroup:{method:'DELETE', url:'riskjudgmentgroup'},

        getDepartmentFileLists:{method:'GET', url: '/file/list?'},

        updateTempleteDisable : {method: 'PUT', url: 'riskjudgmenttemplete/disable'},

        //模板相关
        createRiskJudgmentTemplete:{method:"POST",  url:'riskjudgmenttemplete'},
        updateRiskJudgmentTemplete:{method:"PUT",  url:'riskjudgmenttemplete'},
        deleteRiskJudgmentTemplete:{method:"DELETE", url:'riskjudgmenttemplete'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("riskjudgment"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '5020001001',
        'edit':   '5020001002',
        'delete': '5020001003',
        // 'import': '_YYYYYYY004',
        // 'export': '_YYYYYYY005',
        'enable': '5020001006',
        'copy':'5020001010'
    };
    return resource;
});