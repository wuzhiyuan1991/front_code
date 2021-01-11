define(function(require){

    var Vue = require("vue");
	var apiCfg = require("apiCfg");
	var customActions = {
		//检查表
        //list: {method: 'GET', url: 'checktable/list/{currentPage}/{pageSize}'},
        //get: {method: 'GET', url: 'checktable/{id}'},
        //create: {method: 'POST', url: 'checktable'},
        //update: {method: 'PUT', url: 'checktable'},
	    batchUpdate: {method: 'PUT', url: 'checktable/batch'},
	    del: {method: 'DELETE', url: 'checktable'},
	    //批量启动
	    batchEnable: {method: 'PUT', url: 'checktable/batchEnable'},
	    //批量停用
	    batchDisable: {method: 'PUT', url: 'checktable/batchDisable'},
	    //检查表分类
	    listTableType: {method: 'GET', url: 'checktabletype/list'},
	    createTableType: {method: 'POST', url: 'checktabletype'},
	    updateTableType: {method: 'PUT', url: 'checktabletype'},
	    delTableType: {method: 'DELETE', url: 'checktabletype'},
	    
	    getUUID: {method: 'GET', url: 'helper/getUUID'},
		checkItemType: {method: 'GET', url: 'risktype/list'},
	    //初始化组织机构
	    listOrganization:{method: 'GET', url: 'organization/list'},

	    //关系表操作
	    //添加检查表和检查项的关联
	    createTableItemRel: {method: 'POST', url: 'tableitemrel'},
	    //删除项
	    delTableItem: {method: 'DELETE', url: 'checktable/{id}/checkitems'},
        //删除分组（包括分组下的所有检查项）
	    delTableGroup: {method: 'DELETE', url: 'tableitemrel/deleteByCheckTableId'},
	    //删除空的分组
	    delTableItemRel: {method: 'DELETE', url: 'tableitemrel'},
        updateGroupName: {method: 'PUT', url: 'tableitemrel/updategroupname'},
	    batchCreateTableItemRel:{method: 'POST', url: 'tableitemrel/batch'},
	    batchCreateTableItemRel2:{method: 'POST', url: 'tableitemrel/batch/{groupId}/{itemOrderNo}'},
	    batchCreateTableObjectRel:{method: 'POST', url: 'tableobjectrel/batch'},
		delTableObjRel:{method:'DELETE',url:'tableobjectrel/deleteByTableObj'},

	    createItem:{method:'POST',url:'checktable/{id}/checkitems'},
		updateItem:{method:'PUT',url:'checkitem'},
        queryDepts : {method: 'GET', url: 'checktable/depts/list/{pageNo}/{pageSize}'},
        saveDepts : {method: 'POST', url: 'checktable/{id}/depts'},
        removeDepts : _.extend({method: 'DELETE', url: 'checktable/{id}/depts'}, apiCfg.delCfg),
		//修改否决项状态
		updateRelVetoItem:{method:'PUT',url: 'tableitemrel/{vetoItem}/updateRelVetoItem'},
		updateGroupOrderOn: {method: 'PUT', url: 'tableitemrel/updategroupname'},
		updateItemOrderNo:{method:'PUT',url: 'tableitemrel/{type}/updateItemOrderNo'},
		sortGroup: {method: 'PUT', url: 'checktable/checkitems/sortGroup'},

        saveCheckObject: {method: 'POST', url: 'checktable/{id}/checkobjects'},   // 保存检查对象
		getCheckObjects: {method: 'GET', url: 'checktable/checkobjects/list'},   // 获取检查对象列表
		delCheckObj: {method: 'DELETE', url: 'checktable/{id}/checkobjects'},    // 删除检查对象
		updateCheckItem: {method: 'PUT', url: 'checktable/checkitem/checkobject'}, // 更新检查项
		getCraftTypes: {method: 'GET', url: 'checkobjectcatalog/majorChemicalProcess/list'}, // 重点危化品工艺类型
		delCheckItemCheckObj: {method: 'PUT', url: 'checktable/checkobject'},
		getSpecialDominationAreas: {method: 'GET', url: 'checktable/list/specialdominationareas/{curPage}/{pageSize}'},
		saveSpecialDominationArea: {method: 'POST', url: 'checktable/{checkTableId}/specialdominationareas'},
		delSpecialDominationArea: {method: 'DELETE', url: 'checktable/{checkTableId}/specialdominationareas'},
		clearCheckObject: {method: 'PUT', url: 'checktable/checkobjects'},
		changeIsAllDomination: {method: 'PUT', url: 'checktable'},
		changeIsSpecial: {method: 'PUT', url: 'tableobjectrel'},
        changeIsTemporary: {method: 'PUT', url: 'tableobjectrel'},
        changeIsTemporaryEnable: {method: 'PUT', url: 'tableobjectrel'},
        getTemporaryColumnSetting: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=checkSubmit.isTemporary'},
    };
	customActions = _.defaults(customActions, apiCfg.buildDefaultApi("checktable"));
	var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        create: '2010003001',
        'import': '2010003004',
        'export': '2010003005',
        edit: '2010003002',
        'delete': '2010003003',
        enable: '2010003021'
    };
    return resource;
});