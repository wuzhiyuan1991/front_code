define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        updateDisable: {method: 'PUT', url: 'richecktable/disable'},
        removeRiCheckAreas: _.extend({method: 'DELETE', url: 'richecktable/{id}/richeckareas'}, apiCfg.delCfg),

        checkOrgChanged: {method: 'GET', url: 'richecktable/checkOrgChanged'},

        saveRiCheckAreaTplOrderNo: {method: 'PUT', url: 'richecktable/{id}/richeckareatpls/order'},
        createRiCheckAreaTpl: {method: 'POST', url: 'richecktable/{id}/richeckareatpl'},
        updateRiCheckAreaTpl: {method: 'PUT', url: 'richeckareatpl'},
        queryRiCheckAreaTpls: {method: 'GET', url: 'richecktable/richeckareas/list'},
        saveRiCheckAreaTpls: {method: 'POST', url: 'richecktable/{id}/richeckareatpls'},
        // removeRiCheckAreaTpls: _.extend({method: 'DELETE', url: 'richecktable/{id}/richeckareatpls'}, apiCfg.delCfg),
        // getRiCheckAreaTplList: {method: 'GET', url: 'richeckareatpl/list/{curPage}/{pageSize}'},


        updateRiCheckPoint: {method: 'PUT', url: 'richeckarea/{id}/richeckpoint'},
        saveRiCheckPoint: {method: 'POST', url: 'richeckarea/{id}/richeckpoint'},

        saveRiCheckPointTplOrderNo: {method: 'PUT', url: 'richeckarea/{id}/richeckpointtpls/order'},
        createRiCheckPointTpl: {method: 'POST', url: 'richeckarea/{id}/richeckpointtpl'},
        queryRiCheckPointTpls: {method: 'GET', url: 'richeckarea/richeckpoints/list'},
//        saveRiCheckPointTpls: {method: 'POST', url: 'richeckarea/{id}/richeckpointtpls'},
        updateRiCheckPointTpls: {method: 'PUT', url: 'richeckarea/{id}/richeckpointtpls'},
        removeRiCheckPoints: _.extend({method: 'DELETE', url: 'richeckarea/{id}/richeckpoints'}, apiCfg.delCfg),
        // removeRiCheckPointTpls: _.extend({method: 'DELETE', url: 'richeckarea/{id}/richeckpointtpls'}, apiCfg.delCfg),
        // getRiCheckPointTplList: {method: 'GET', url: 'richeckpointtpl/list/{curPage}/{pageSize}'},

        // queryRiCheckPointItemRels: {method: 'GET', url: 'richeckpoint/richeckpointitemrels/list'},
        // saveRiCheckPointItemRel: {method: 'POST', url: 'richeckpoint/{id}/richeckpointitemrel'},
        // removeRiCheckPointItemRels: _.extend({method: 'DELETE', url: 'richeckpoint/{id}/richeckpointitemrels'}, apiCfg.delCfg),
        // updateRiCheckPointItemRel: {method: 'PUT', url: 'richeckpoint/{id}/richeckpointitemrel'},

        saveRiCheckItemOrderNo: {method: 'PUT', url: 'richeckpoint/{id}/richeckitems/order'},
        createRiCheckItem: {method: 'POST', url: 'richeckpoint/{id}/richeckitem'},
        updateRiCheckItem: {method: 'PUT', url: 'richeckitem'},
        // queryRiCheckItems: {method: 'GET', url: 'richeckpoint/richeckitems/list/{pageNo}/{pageSize}'},
        // saveRiCheckItems: {method: 'POST', url: 'richeckpoint/{id}/richeckitems'},
        removeRiCheckItems: _.extend({method: 'DELETE', url: 'richeckpoint/{id}/richeckitems'}, apiCfg.delCfg),

        //巡检项的巡检类型
        // queryRiCheckItemTypeRels: {method: 'GET', url: 'richeckitem/richeckitemtyperels/list/{pageNo}/{pageSize}'},
        // saveRiCheckItemTypeRel: {method: 'POST', url: 'richeckitem/{id}/richeckitemtyperel'},
        // removeRiCheckItemTypeRels: _.extend({method: 'DELETE', url: 'richeckitem/{id}/richeckitemtyperels'}, apiCfg.delCfg),
        // updateRiCheckItemTypeRel: {method: 'PUT', url: 'richeckitem/{id}/richeckitemtyperel'},

        //巡检项的适用设备状态
        // queryRiCheckItemEquipmentStateRels: {method: 'GET', url: 'richeckitem/richeckitemequipmentstaterels/list/{pageNo}/{pageSize}'},
        // saveRiCheckItemEquipmentStateRel: {method: 'POST', url: 'richeckitem/{id}/richeckitemequipmentstaterel'},
        // removeRiCheckItemEquipmentStateRels: _.extend({method: 'DELETE', url: 'richeckitem/{id}/richeckitemequipmentstaterels'}, apiCfg.delCfg),
        // updateRiCheckItemEquipmentStateRel: {method: 'PUT', url: 'richeckitem/{id}/richeckitemequipmentstaterel'},

        //巡检项的巡检结果
        // queryRiCheckResults: {method: 'GET', url: 'richeckitem/richeckresults/list/{pageNo}/{pageSize}'},
        // saveRiCheckResults: {method: 'POST', url: 'richeckitem/{id}/richeckresults'},
        // removeRiCheckResults: _.extend({method: 'DELETE', url: 'richeckitem/{id}/richeckresults'}, apiCfg.delCfg),

        queryResults: {method: 'GET', url: 'richeckresult/list/{curPage}/{pageSize}'},
        queryCheckTypes: {method: 'GET', url: 'richecktype/list/{curPage}/{pageSize}'},

        submitCheckTable: {method: 'PUT', url: 'richecktable/submit'}, // 提交审核
        auditCheckTable: {method: 'PUT', url: 'richecktable/audit'}, // 审核
        quitCheckTable: {method: 'PUT', url: 'richecktable/quit'}, // 弃审

        queryProcessStatus: {method: 'GET', url: 'auditrecord/preview'},
        submitAudit: {method: 'POST', url: 'richecktable/{id}/auditrecord'},
        queryLookupItem: {method: 'GET', url: 'lookup/lookupitems/list?code=audit_process_switch'},
        saveAuditProcessRecord: {method: 'POST', url: 'richecktable/{id}/auditrecord'},
        getProcessRecordList: {method: 'GET', url: 'richecktable/auditrecords/list'},
        getUndoCount: {method: 'GET', url: 'richecktable/todo/num'},


        checkRouteExist: {method: 'GET', url: 'richecktable/haveCheckItems/{id}'}

    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("richecktable"));
    var resource = Vue.resource(null, {}, customActions);
    resource.__auth__ = {
        'create': '2320001001',
        'edit': '2320001002',
        'delete': '2320001003',
        'enable': '2320001006',
        'import': '2320001004',
        'export': '2320001005',
        'submit': '2320001007',
        'audit': '2320001008',
        'quit': '2320001009',
        'process': '2320001010',//审批流设置
        'processEdit':'2320001011',//审批流编辑
        "exportList":'2320001012',//导出列表
        "importToUpdate":'2320001013'//导入更新
    };
    return resource;
});