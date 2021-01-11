define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        batchUpdate: {method: 'PUT', url: 'tpachecktable/batch'},
        del: {method: 'DELETE', url: 'tpachecktable'},
        //批量启动
        batchEnable: {method: 'PUT', url: 'tpachecktable/batchEnable'},
        //批量停用
        batchDisable: {method: 'PUT', url: 'tpachecktable/batchDisable'},
        //检查表分类
        listTableType: {method: 'GET', url: 'tpachecktabletype/list'},
        createTableType: {method: 'POST', url: 'checktabletype'},
        updateTableType: {method: 'PUT', url: 'checktabletype'},
        delTableType: {method: 'DELETE', url: 'checktabletype'},

        getUUID: {method: 'GET', url: 'helper/getUUID'},
        checkItemType: {method: 'GET', url: 'tparisktype/list'},
        //初始化组织机构
        listOrganization:{method: 'GET', url: 'organization/list'},
        //部门
        lisDept:{method: 'GET', url: 'organization/list/dept'},

        //关系表操作
        //添加检查表和检查项的关联
        createTableItemRel: {method: 'POST', url: 'tpatableitemrel'},
        //删除项
        delTableItem: {method: 'DELETE', url: 'tpatableitemrel/deleteItem'},
        //删除分组（包括分组下的所有检查项）
        delTableGroup: {method: 'DELETE', url: 'tpatableitemrel/deleteByCheckTableId'},
        //删除空的分组
        delTableItemRel: {method: 'DELETE', url: 'tpatableitemrel'},
        updateGroupName: {method: 'PUT', url: 'tpatableitemrel/updategroupname'},
        batchCreateTableItemRel:{method: 'POST', url: 'tpatableitemrel/batch'},
        batchCreateTableObjectRel:{method: 'POST', url: 'tableobjectrel/batch'},
        delTableObjRel:{method:'DELETE',url:'tableobjectrel/deleteByTableObj'},

        listDept: {method: 'GET', url: 'organization/list'},
        createItem:{method:'POST',url:'tpachecktable/{id}/checkitems'},
        updateItem:{method:'PUT',url:'/tpacheckitem'},
        queryDepts : {method: 'GET', url: 'tpachecktable/depts/list/{pageNo}/{pageSize}'},
        saveDepts : {method: 'POST', url: 'tpachecktable/{id}/depts'},
        removeDepts : _.extend({method: 'DELETE', url: 'tpachecktable/{id}/depts'}, apiCfg.delCfg),
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("tpachecktable"));
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});