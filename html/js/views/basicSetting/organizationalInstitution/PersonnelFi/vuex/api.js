define(function(require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {

        //list: {method: 'GET', url: 'user/list/{pageNo}/{pageSize}'},
        //get: {method: 'GET', url: 'user/{id}'},
        //create: {method: 'POST', url: 'user'},
        //update: {method: 'PUT', url: 'user'},
        del: { method: 'DELETE', url: "user" },
        updateDisable: { method: "PUT", url: 'user/disable' },
        updateStartup: { method: "PUT", url: 'user/startup' },
        getPsd: { method: 'GET', url: 'envconfig/{type}' },
        //获取业务对象关联的文件信息
        listTree: { method: 'GET', url: 'user/tree' },
        listPosByName: { method: 'GET', url: 'position/like' },
        listRoleByName: { method: 'GET', url: 'role/like' },
        listUser: { method: 'GET', url: 'user/list' },
        listPos: { method: 'GET', url: 'position/list?disable=0' },
        listRole: { method: 'GET', url: 'role/list?disable=0' },
        listDept: { method: 'GET', url: 'organization/list' },
        distributionRole: { method: 'PUT', url: 'user/distribution/role' },
        distributionPosition: { method: 'PUT', url: 'user/distribution/position' },
        distributionHsePosition: { method: 'PUT', url: 'user/distribution/position/hse' },
        delPos: { method: 'DELETE', url: 'user/position' },
        delRole: { method: 'DELETE', url: 'user/role' },
        delOtherRole: { method: 'DELETE', url: 'user/other/role' },
        validateMobile: { method: 'GET', url: "user/mobile" },
        reset: { method: 'PUT', url: 'user/reset/admin/pwd' },
        resetBatch: { method: 'PUT', url: 'user/reset/admin/pwdBatch' },
        relevance: { method: 'GET', url: 'organization/list/relevance' },
        downloadQrCode: { method: 'GET', url: 'user/download/{code}' },

        //list : {method: 'GET', url: 'user/list/{pageNo}/{pageSize}'},
        get: { method: 'GET', url: 'user/{id}' },
        //create : {method: 'POST', url: 'user'},
        //update : {method: 'PUT', url: 'user'},
        //remove : _.extend({method: 'DELETE', url: 'user'}, apiCfg.delCfg),
        //exportExcel : {method: 'GET', url: 'user/exportExcel'},
        //importExcel : {method: 'POST', url: 'user/importExcel'},
        queryRoles: { method: 'GET', url: 'user/roles/list/{pageNo}/{pageSize}' },
        saveRoles: { method: 'POST', url: 'user/{id}/roles' },
        saveOtherRoles: { method: 'POST', url: 'user/{id}/other/roles' },
        savePositions: { method: 'POST', url: 'user/{id}/positions' },
        removeRoles: _.extend({ method: 'DELETE', url: 'user/{id}/roles' }, apiCfg.delCfg),
        listCompany: { method: 'GET', url: 'organization/company/list' },

        unlock: { method: "PUT", url: 'user/unlock' },
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("user"));
    var resource = Vue.resource(null, {}, customActions);
    resource.__auth__ = {
        'create': '1020003001',
        'import': '1020003004',
        'export': '1020003005',
        'edit': '1020003002',
        'delete': '1020003003',
        'enable': '1020003020',
        'resetPwd': '1020003610',
        'grantRole': '1020003607',
        'grantPosition': '1020003608',
        'grantHseRole': '1020003609',
        'copy':'1020003010',
        'unLock':'1020003611',
        'resetAllPwd':'1020003612'
    };
    return resource;
});