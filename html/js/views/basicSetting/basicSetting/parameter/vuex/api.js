define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");
    var customActions = {
        get: {method: 'GET', url: 'envconfig/{type}'},
        //update: {method: 'PUT', url: 'envconfig'},
        //deleteFile:{method:'DELETE',url:'file'},
        save:{method:'POST',url:'envconfig'},
        getCheckTables: {method: 'GET', url: 'checktable/list/1/9999'},
        getParameters: {method: 'GET', url: 'systembusinessset/root'},
        saveBusinessSet: {method: 'PUT', url: 'systembusinessset/saveBusinessSet'},
        getParameterDetail: {method: 'GET', url: 'systembusinesssetdetail/list/{curPage}/{pageSize}'},
        addParameterDetail: {method: 'POST', url: 'systembusinesssetdetail'},
        deleteParameterDetail: {method: 'DELETE', url: 'systembusinesssetdetail'},
        //重点监管部门 BEGIN
        addSupervisePointDept: {method: 'POST', url: 'supervisepointdept/batch'},
        //重点监管部门 END
        queryVersions: {method: 'GET', url: 'superadmin/webversion/list'},
        queryUsers:{method: 'GET', url: 'user/list/1/9999'},
        queryRoles:{method: 'GET', url: 'role/list/1/9999?attr1=1'},
        clearAll :{method: 'DELETE', url: 'cache/all'},

        // queryPositions : {method: 'GET', url: 'systembusinessset/positions/list/{pageNo}/{pageSize}'},
        savePositions : {method: 'POST', url: 'systembusinessset/{id}/{compId}/positions'},
        removePositions : _.extend({method: 'DELETE', url: 'systembusinessset/{id}/positions'}, apiCfg.delCfg),

        // queryUsersRel : {method: 'GET', url: 'systembusinessset/users/list/{pageNo}/{pageSize}'},
        saveUsers : {method: 'POST', url: 'systembusinessset/{id}/{compId}/users'},

        removeUsers : _.extend({method: 'DELETE', url: 'systembusinessset/{id}/users'}, apiCfg.delCfg),
        distributionMenuAndFunc: {method: 'POST', url: 'role/{id}/auth'},
        distributionMenuAndFuncs: {method: 'POST', url: 'role/auth/{type}/batch'},
        listMenu:{method:"GET", url: 'menu/{roleId}/list'},
        listRoleMenu:{method:"GET", url: 'menu/roles/list'},
        listRoleMenu:{method:"GET", url: 'menu/roles/list'},
        getFunc: {method: 'GET', url: 'role/func'},
         getAppMenuList: {method: 'GET', url: 'role/appfunc'},
        getAppAllMenuList: {method: 'GET', url: 'menu/app/{roleId}/list'},
        getAppRolesList: {method: 'GET', url: 'menu/app/roles/list'},
        getAppSetEnable: {method: 'GET', url: 'lookup/syscfg/value?path=sys_global_conf.app_auth_setting_enable'}
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("envconfig"));
    var resource = Vue.resource(null, {}, customActions);
    return resource;
});